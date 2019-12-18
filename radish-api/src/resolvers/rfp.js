import { pubsub } from '../subscriptions';
import db from '../db';
import { saveMessage } from './message';

const NEW_RFP = 'NEW_RFP';

const getRFPById = async id => {
  const rfp = await db.collection('rfp').findOne({ _id: id });
  return rfp;
};

const getAllRFPs = async () => {
  const rfps = await db
    .collection('rfp')
    .find({})
    .toArray();
  return rfps;
};

const saveRFP = async input => {
  const count = await db.collection('rfp').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const rfp = await db.collection('rfp').insert(doc);
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
      await saveMessage({
        resolved: false,
        category: 'rfp',
        subject: `New RFP: ${rfp.description}`,
        from: 'Buyer',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: rfp._id,
        lastModified: new Date(Date.now()),
      });
      pubsub.publish(NEW_RFP, { newRFP: rfp });
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
