import { pubsub } from '../subscriptions';
import db from '../db';
import { uuid } from 'uuidv4';
import { saveMessage } from './message';
import messenger from '../utils/messengerWrapper.js';

const NEW_RFP = 'NEW_RFP';

const getRFPById = async id => {
  const rfp = await db.collection('RFPs').findOne({ _id: id });
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
      return getRFPById(args.id).then(res => res);
    },
    rfps() {
      return getAllRFPs();
    },
  },
  Mutation: {
    createRFP: async (_parent, args) => {
      const newRFP = await saveRFP(args.input);
      const rfp = newRFP.ops[0];
      const currentTime = await Math.floor(Date.now() / 1000);
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
      console.log(`Sending RFP (uuid: ${rfp._id}) to recipients...`)
      rfp.type = 'rfp_create';
      rfp.sender = process.env.MESSENGER_ID;
      rfp.uuid = rfp._id;
      rfp.createdDate = currentTime;
      rfp.recipients.forEach(async (partner) => {
        messenger.createMessage(process.env.MESSENGER_ID, partner.identity, rfp);
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
