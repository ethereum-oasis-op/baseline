import { pubsub } from '../subscriptions';
import db from '../db';
import { saveMessage } from './message';

const NEW_QUOTE = 'NEW_QUOTE';

const getQuoteById = async id => {
  const quotes = await db.collection('quote').findOne({ _id: id });
  return quotes;
};

const getAllQuotes = async () => {
  const quotes = await db
    .collection('quote')
    .find({})
    .toArray();
  return quotes;
};

const saveQuote = async input => {
  const count = await db.collection('quote').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const quote = await db.collection('quote').insert(doc);
  return quote;
};

export default {
  Query: {
    quote(_parent, args) {
      return getQuoteById(args.id).then(res => res);
    },
    quotes() {
      return getAllQuotes();
    },
  },
  Mutation: {
    createQuote: async (_parent, args) => {
      const newQuote = await saveQuote(args.input);
      const quote = newQuote.ops[0];
      await saveMessage({
        resolved: false,
        category: 'quote',
        subject: `New Quote: for RFQ ${quote.rfqId}`,
        from: 'Supplier',
        statusText: 'Pending',
        status: 'outgoing',
        categoryId: quote._id,
        lastModified: new Date(Date.now()),
      });
      pubsub.publish(NEW_QUOTE, { newQuote: quote });
      return { ...quote };
    },
  },
  Subscription: {
    newQuote: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_QUOTE);
      },
    },
  },
};
