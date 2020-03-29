import { getMSAById, extractMSAFromDoc, MSA, updateMSAWithNewCommitment } from '../services/msa';
import { getPOById, getAllPOs, PO, savePO, createPO } from '../services/po';
import { getPartnerByzkpPublicKey, getPartnerByMessengerKey } from '../services/partner';
import { saveNotice } from '../services/notice';

import { getServerSettings } from '../utils/serverSettings';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';

const NEW_PO = 'NEW_PO';

export default {
  Query: {
    po: async (_parent, args) => {
      const { id } = args;
      const po = await getPOById(id);
      const supplier = await getPartnerByzkpPublicKey(po.constants.zkpPublicKeyOfSupplier);
      const { identity } = supplier;
      return {
        ...po,
        whisperPublicKeyOfSupplier: identity,
      }
    },
    pos() {
      return getAllPOs();
    },
  },
  Mutation: {
    createPO: async (_parent, args, context) => {
      const { identity } = context;
      const { input } = args;
      const currentUser = await getPartnerByMessengerKey(identity);
      const { address: currentUserAddress, name: currentUserName } = currentUser;
      try {
        console.log('\n\n\nRequest to create PO with inputs:');
        console.log(input);
        /*
        currentUser: {
          _id: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
          currentUserAddress: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
          identity:  '0x042dd4912150fe2ecdbb4bd84a2f44dce6bac3530f2f6d702db27686898a8cd1185e3988aae09508680f815ed3494d11de18026ecd641da2786490a6fa3b33bf18'
          name: 'Org1',
          role: 1
        }
        */
        pubsub.publish('INCOMING_TOASTR_NOTIFICATION', {
          onNotification: {
            success: true,
            message: 'PO creation in progress... This may take some time',
            userAddress: currentUserAddress,
          }
        });

        const { msaId, volume, deliveryDate, description } = input;

        const oldMSADoc = await getMSAById(msaId);

        const oldMSA = new MSA(extractMSAFromDoc(oldMSADoc));

        const oldMSAObject = oldMSA.object;

        const price = oldMSA.price(volume);
        console.log(`\nCalculated a price of ${price} for this PO`);
        const { constants } = oldMSAObject;
        const {
          zkpPublicKeyOfBuyer,
          zkpPublicKeyOfSupplier,
          sku,
          erc20ContractAddress,
        } = constants;

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

        const { _id } = oldMSA;
        const { variables } = oldMSA.object;
        const newMSA = new MSA({
          _id,
          constants,
          variables: { ...variables, accumulatedVolumeOrdered },
        });

        const settings = await getServerSettings();
        const { zkpPrivateKey } = settings.organization;
        const zkpPrivateKeyOfBuyer = zkpPrivateKey;

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
        const { sku } = poObject.constants;

        const poDoc = await savePO(poObject);
        const { _id: poDocId } = poDoc;
        const supplier = await getPartnerByzkpPublicKey(zkpPublicKeyOfSupplier);

        await saveNotice({
          resolved: false,
          category: 'po',
          subject: `New PO for SKU: ${sku}`,
          from: currentUserName,
          statusText: 'Pending',
          status: 'outgoing',
          categoryId: poDocId,
          lastModified: Math.floor(Date.now() / 1000),
        });

        console.log(`\nSending PO (id: ${poDocId}) to supplier...`);
        const senderId = currentUser.identity;
        const recipientId = supplier.identity;
        const { zkpPublicKey: supplierZkpPublicKey } = supplier;
        // Add to BullJS queue
        msgDeliveryQueue.add({
          documentId: poDocId,
          senderId,
          recipientId,
          payload: {
            type: 'po_create',
            po: poDoc,
            msa: newMSADoc,
          },
        });

        pubsub.publish(NEW_PO, { newPO: { ...poDoc, whisperPublicKeyOfSupplier: supplier.zkpPublicKey } });

        return { ...poDoc, whisperPublicKeyOfSupplier: supplierZkpPublicKey };
      } catch (e) {
        pubsub.publish('INCOMING_TOASTR_NOTIFICATION', {
          onNotification: {
            success: false,
            message: 'Something went wrong during PO creation, please try again.',
            userAddress: currentUserAddress,
          }
        });
        throw new Error(e);
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
