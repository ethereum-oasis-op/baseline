import { getRFPById, getAllRFPs } from '../services/rfp';
import { saveNotice } from '../services/notice';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { saveRFP } from '../db/models/modules/rfps';
import { getPartnerByMessengerKey } from '../services/partner';

const NEW_RFP = 'NEW_RFP';

export default {
  Query: {
    async rfp(_parent, args) {
      const res = await getRFPById(args.uuid);
      return res;
    },
    rfps() {
      return getAllRFPs();
    },
  },
  Mutation: {
    createRFP: async (_parent, args, context) => {
      const currentUser = context.identity
        ? await getPartnerByMessengerKey(context.identity)
        : null;
      const currentTime = Math.floor(Date.now() / 1000);
      const myRFP = args.input;
      myRFP.createdDate = currentTime;
      myRFP.sender = context.identity;
      const rfp = (await saveRFP(myRFP))._doc;
      const { description: rfpDesc, _id: rfpId } = rfp;
      await saveNotice({
        resolved: false,
        category: 'rfp',
        subject: `New RFP: ${rfpDesc}`,
        from: currentUser ? currentUser.name : 'Buyer',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: rfpId,
        lastModified: currentTime,
      });
      pubsub.publish(NEW_RFP, { newRFP: rfp });
      console.log(`Sending RFP (uuid: ${rfpId}) to recipients...`);
      const { recipients, ...rfpDetails } = rfp;
      rfpDetails.type = 'rfp_create';
      rfpDetails.uuid = rfpId;
      recipients.forEach(recipient => {
        // For data structure parity between buyer/supplier systems
        // put the recipient back as the only entry in the array
        const rfpToSend = { ...rfpDetails, recipients: [recipient] };
        // Add to BullJS queue
        msgDeliveryQueue.add(
          {
            documentId: rfpId,
            senderId: context.identity,
            recipientId: recipient.partner.context.identity,
            payload: rfpToSend,
          },
          {
            // Mark job as failed after 20sec so subsequent jobs are not stalled
            timeout: 20000,
          },
        );
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
