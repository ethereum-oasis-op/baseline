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
      console.log('\n\n\nRequest to create PO with inputs:');
      console.log(args.input);
      /*
      currentUser: {
        _id: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
        address: '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
        identity:  '0x042dd4912150fe2ecdbb4bd84a2f44dce6bac3530f2f6d702db27686898a8cd1185e3988aae09508680f815ed3494d11de18026ecd641da2786490a6fa3b33bf18'
        name: 'Org1',
        role: 1
      }
      */
      const currentUser = await getPartnerByMessengerKey(context.identity);

      const { msaId, volume, deliveryDate, description } = args.input;

      const oldMSADoc = await getMSAById(msaId);

      const oldMSA = new MSA(extractMSAFromDoc(oldMSADoc));

      const oldMSAObject = oldMSA.object;

      const price = oldMSA.price(volume);
      console.log(`\nCalculated a price of ${price} for this PO`);

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

      console.log(`\nSending PO (id: ${poDoc._id}) to supplier...`);
      const senderId = currentUser.identity;
      const recipientId = supplier.identity;
      // Add to BullJS queue
      msgDeliveryQueue.add({
        documentId: poDoc._id,
        senderId,
        recipientId,
        payload: {
          type: 'po_create',
          po: poDoc,
          msa: newMSADoc,
        },
      });

      pubsub.publish(NEW_PO, { newPO: po });

      return { ...po };
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
