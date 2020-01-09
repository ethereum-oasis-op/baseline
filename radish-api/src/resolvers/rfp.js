import { pubsub } from '../subscriptions';
import db from '../db';
import { uuid } from 'uuidv4';
import { saveMessage } from './message';
import messenger from '../utils/messengerWrapper.js';

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

const saveRFP = async input => {
  const rfpId = await uuid();
  const doc = Object.assign(input, { _id: rfpId });
  const rfp = await db.collection('RFPs').insertOne(doc);
  return rfp;
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
      let myRFP = args.input;
      myRFP.createdDate = currentTime;
      myRFP.sender = process.env.MESSENGER_ID;
      const newRFP = await saveRFP(myRFP);
      const rfp = newRFP.ops[0];
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
      const { recipients, ...rfpDetails } = rfp
      rfpDetails.type = 'rfp_create';
      rfpDetails.uuid = rfp._id;
      recipients.forEach(async (partner) => {
        messenger.createMessage(process.env.MESSENGER_ID, partner.identity, rfpDetails);
      })
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
