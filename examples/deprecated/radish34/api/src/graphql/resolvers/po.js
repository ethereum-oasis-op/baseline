import { getMSAById, extractMSAFromDoc, MSA, updateMSAWithNewCommitment } from '../../services/msa';
import { getPOById, getAllPOs, PO, savePO, createPO } from '../../services/po';
import { getPartnerByzkpPublicKey, getPartnerByMessagingKey } from '../../services/partner';
import { saveNotice } from '../../services/notice';

import { getServerSettings } from '../../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../../queues/message_delivery';
import { logger } from 'radish34-logger';

const NEW_PO = 'NEW_PO';

export default {
  Query: {
    po: async (_parent, args) => {
      const po = await getPOById(args.id).then(res => res);
      const supplier = await getPartnerByzkpPublicKey(po.constants.zkpPublicKeyOfSupplier);

      return {
        ...po,
        whisperPublicKeyOfSupplier: supplier.identity,
      }
    },
    pos() {
      return getAllPOs();
    },
  },
  Mutation: {
    createPO: async (_parent, args, context) => {
      const currentUser = await getPartnerByMessagingKey(context.identity);
      try {
        logger.info(`Request to create PO with inputs:\n%o`, args.input, { service: 'API' });
        /*
        currentUser: {
          _id: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
          address: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
          identity:  '0x042dd4912150fe2ecdbb4bd84a2f44dce6bac3530f2f6d702db27686898a8cd1185e3988aae09508680f815ed3494d11de18026ecd641da2786490a6fa3b33bf18'
          name: 'Org1',
          role: 1
        }
        */
        pubsub.publish('INCOMING_TOASTR_NOTIFICATION', {
          onNotification: {
            success: true,
            message: 'PO creation in progress... This may take some time',
            userAddress: currentUser.address,
          }
        });

        const { msaId, volume, deliveryDate, description } = args.input;

        const oldMSADoc = await getMSAById(msaId);

        const oldMSA = new MSA(extractMSAFromDoc(oldMSADoc));

        const oldMSAObject = oldMSA.object;

        const price = oldMSA.price(volume);
        logger.info(`Calculated a price of ${price} for this PO.`, { service: 'API' });

        const {
          zkpPublicKeyOfBuyer,
          zkpPublicKeyOfSupplier,
          sku,
          erc20ContractAddress,
        } = oldMSAObject.constants;

        const po = new PO({
          metadata: {
            msaId,
          },
          constants: {
            zkpPublicKeyOfBuyer,
            zkpPublicKeyOfSupplier,
            volume,
            price,
            sku,
            erc20ContractAddress,
          },
        });

        // Create a newMSA with updated variables:
        let { accumulatedVolumeOrdered } = oldMSAObject.commitments[0].variables;
        accumulatedVolumeOrdered += volume;

        const newMSA = new MSA({
          _id: oldMSA._id,
          constants: oldMSA.object.constants,
          variables: { ...oldMSA.object.variables, accumulatedVolumeOrdered },
        });

        const settings = await getServerSettings();
        const zkpPrivateKeyOfBuyer = settings.organization.zkpPrivateKey;

        // keep unused variables here for now; they might be used soon...
        const {
          transactionHash,
          newMSALeafIndex,
          newMSALeafValue,
          newPOLeafIndex,
          newPOLeafValue,
          newRoot,
        } = await createPO(zkpPrivateKeyOfBuyer, oldMSA, newMSA, po);

        newMSA.commitment.index = newMSALeafIndex;
        po.commitment.index = newPOLeafIndex;

        const newMSAObject = newMSA.object;

        const newMSADoc = await updateMSAWithNewCommitment(newMSAObject);

        const poObject = po.object;
        poObject.metadata = {
          msaId,
          deliveryDate,
          description,
        };

        const poDoc = await savePO(poObject);

        const supplier = await getPartnerByzkpPublicKey(zkpPublicKeyOfSupplier);

        await saveNotice({
          resolved: false,
          category: 'po',
          subject: `New PO for SKU: ${poObject.constants.sku}`,
          from: currentUser.name,
          statusText: 'Pending',
          status: 'outgoing',
          categoryId: poDoc._id,
          lastModified: Math.floor(Date.now() / 1000),
        });

        logger.info(`Sending PO with id ${poDoc._id} to supplier.`, { service: 'API' });
        const senderId = currentUser.messagingKey;
        const recipientId = supplier.messagingKey;
        // Add to BullJS queue
        msgDeliveryQueue.add(
          {
            documentId: poDoc._id,
            senderId,
            recipientId,
            payload: {
              type: 'po_create',
              po: poDoc,
              msa: newMSADoc,
            },
          },
          {
            // Mark job as failed after 20sec so subsequent jobs are not stalled
            timeout: 20000,
          },
        );

        pubsub.publish(NEW_PO, { newPO: { ...poDoc, whisperPublicKeyOfSupplier: supplier.messagingKey } });

        return { ...poDoc, whisperPublicKeyOfSupplier: supplier.messagingKey };
      } catch (err) {
        pubsub.publish('INCOMING_TOASTR_NOTIFICATION', {
          onNotification: {
            success: false,
            message: 'Something went wrong during PO creation, please try again.',
            userAddress: currentUser.address,
          }
        });
        logger.error(`Error in createPO.\n%o`, err, { service: 'API' });
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newPO: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_PO);
      },
    },
  },
};
