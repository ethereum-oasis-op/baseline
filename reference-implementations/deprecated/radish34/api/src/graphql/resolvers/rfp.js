import { getRFPById, getAllRFPs } from '../../services/rfp';
import { saveNotice } from '../../services/notice';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../../queues/message_delivery';
import { saveRFP } from '../../db/models/modules/rfps';
import { getPartnerByMessagingKey } from '../../services/partner';
import { logger } from 'radish34-logger';

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
      const currentUser = context.identity
        ? await getPartnerByMessagingKey(context.identity)
        : null;
      const currentTime = Math.floor(Date.now() / 1000);
      const myRFP = args.input;
      myRFP.createdDate = currentTime;
      myRFP.sender = context.identity;
      const rfp = (await saveRFP(myRFP))._doc;
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
      logger.info(`Sending RFP wit uuid ${rfp._id} to recipients.`, { service: 'API' });
      const { recipients, ...rfpDetails } = rfp;
      rfpDetails.type = 'rfp_create';
      rfpDetails.uuid = rfp._id;
      recipients.forEach(recipient => {
        // For data structure parity between buyer/supplier systems
        // put the recipient back as the only entry in the array
        const rfpToSend = { ...rfpDetails, recipients: [recipient] };
        // Add to BullJS queue
        msgDeliveryQueue.add(
          {
            documentId: rfp._id,
            senderId: context.identity,
            recipientId: recipient.partner.identity,
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
