import { pubsub } from '../subscriptions';
import db from '../db';
import { saveMessage } from './message';

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
  const doc = Object.assign(input, { _id: count + 1 });
  const rfq = await db.collection('rfq').insert(doc);
  return rfq;
};

export default {
  Query: {
    rfq(_parent, args) {
      return getRFQById(args.id).then(res => res);
    },
    rfqs() {
      return getAllRFQs();
    },
  },
  Mutation: {
    createRFQ: async (_parent, args) => {
      const newRFQ = await saveRFQ(args.input);
      const rfq = newRFQ.ops[0];
      await saveMessage({
        resolved: false,
        category: 'rfq',
        subject: `New RFQ: ${rfq.description}`,
        from: 'Buyer',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: rfq._id,
        lastModified: new Date(Date.now()),
      });
      pubsub.publish(NEW_RFQ, { newRFQ: rfq });
      return { ...rfq };
    },
  },
  Subscription: {
    newRFQ: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_RFQ);
      },
    },
  },
};
