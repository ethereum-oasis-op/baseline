import { getRFPById, getAllRFPs } from '../services/rfp';
import { saveNotice } from '../services/notice';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { onCreateRFP } from '../integrations/rfp';
import { getPartnerByIdentity } from '../services/partner';

const NEW_RFP = 'NEW_RFP';

export default {
  Query: {
    rfp(_parent, args) {
      return getRFPById(args.uuid).then(res => res);
    },
    rfps() {
      return getAllRFPs();
    },
  },
  Mutation: {
    createRFP: async (_parent, args, context) => {
      const currentUser = context.identity ? await getPartnerByIdentity(context.identity) : null;
      const currentTime = Math.floor(Date.now() / 1000);
      const myRFP = args.input;
      myRFP.createdDate = currentTime;
      myRFP.sender = context.identity;
      const rfp = (await onCreateRFP(myRFP))._doc;
      await saveNotice({
        resolved: false,
        category: 'rfp',
        subject: `New RFP: ${rfp.description}`,
        from: currentUser ? currentUser.name : 'Buyer',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: rfp._id,
        lastModified: currentTime,
      });
      pubsub.publish(NEW_RFP, { newRFP: rfp });
      console.log(`Sending RFP (uuid: ${rfp._id}) to recipients...`);
      const { recipients, ...rfpDetails } = rfp;
      rfpDetails.type = 'rfp_create';
      rfpDetails.uuid = rfp._id;
      recipients.forEach(recipient => {
        // Add to BullJS queue
        msgDeliveryQueue.add({
          documentId: rfp._id,
          senderId: context.identity,
          recipientId: recipient.partner.identity,
          payload: rfpDetails,
        });
      });
      return { ...rfp };
    },
  },
  Subscription: {
    newRFP: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_RFP);
      },
    },
  },
};
