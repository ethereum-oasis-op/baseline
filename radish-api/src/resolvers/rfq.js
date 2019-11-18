import { pubsub } from '../subscriptions';
import db from '../db';

const NEW_RFQ = 'NEW_RFQ';

const getRFQById = async id => {
  const rfq = await db.collection('rfq').findOne({ _id: id });
  return rfq;
};

const getAllRFQs = async () => {
  const rfqs = await db
    .collection('rfq')
    .find({})
    .toArray();
  return rfqs;
};

const saveRFQ = async input => {
  const count = await db.collection('rfq').count({});
  input._id = count + 1;
  const rfq = await db.collection('rfq').insert(input);
  return rfq;
};

export default {
  Query: {
    rfq(parent, args, context, info) {
      return getRFQById(args.id).then(res => res);
    },
    rfqs(parent, args, context, info) {
      return getAllRFQs();
    },
  },
  Mutation: {
    createRFQ: async (root, args, context, info) => {
      const newRFQ = await saveRFQ(args.input);
      const rfq = newRFQ.ops[0];
      pubsub.publish(NEW_RFQ, { newRFQ: rfq });
      return { ...rfq };
    },
  },
  Subscription: {
    newRFQ: {
      subscribe: (root, args, context) => {
        return pubsub.asyncIterator(NEW_RFQ);
      },
    },
  },
};
