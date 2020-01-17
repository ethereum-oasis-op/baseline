import db from '../db';
import { saveMessage } from './message';
import { pubsub } from '../subscriptions';
import msgDeliveryQueue from '../queues/message_delivery';
import { onCreateRFP } from '../integrations/rfp.js';

const NEW_RFP = 'NEW_RFP';

const getRFPById = async uuid => {
  const rfp = await db.collection('RFPs').findOne({ _id: uuid });
  return rfp;
};

const getAllRFPs = async () => {
  const rfps = await db
    .collection('RFPs')
    .find({})
    .toArray();
  return rfps;
};

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
    createRFP: async (_parent, args) => {
      const currentTime = await Math.floor(Date.now() / 1000);
      const myRFP = args.input;
      myRFP.createdDate = currentTime;
      myRFP.sender = process.env.MESSENGER_ID;
      const rfp = (await onCreateRFP(myRFP))._doc;
      await saveMessage({
        resolved: false,
        category: 'rfp',
        subject: `New RFP: ${rfp.description}`,
        from: 'Buyer',
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
        msgDeliveryQueue.add(
          {
            documentId: rfp._id,
            senderId: process.env.MESSENGER_ID,
            recipientId: recipient.partner.identity,
            payload: rfpDetails,
          },
          {
            // Mark job as failed after 20sec so subsequent jobs are not stalled
            timeout: 20000
          }
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
