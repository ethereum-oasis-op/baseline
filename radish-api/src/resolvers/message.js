import { pubsub } from '../subscriptions';
import db from '../db';

const NEW_MESSAGE = 'NEW_MESSAGE';

const getMessageById = async id => {
  const message = await db.collection('messages').findOne({ _id: id });
  return message;
};

const getAllMessages = async () => {
  const messages = await db
    .collection('messages')
    .find({})
    .toArray();
  return messages;
};

const getMessagesByCategory = async category => {
  const messages = await db
    .collection('messages')
    .find({ category })
    .toArray();
  return messages;
};

const getInbox = async () => {
  const messages = await db
    .collection('messages')
    .find({ status: 'incoming' })
    .toArray();
  return messages;
};

const getOutbox = async () => {
  const messages = await db
    .collection('messages')
    .find({ status: 'outgoing' })
    .toArray();
  return messages;
};

const saveMessage = async input => {
  console.log('Saving the message');
  const count = await db.collection('messages').count({});
  const doc = Object.assign(input, { _id: count + 1 });
  const message = await db.collection('messages').insert(doc);
  return message;
};

export default {
  Query: {
    message(_parent, args) {
      return getMessageById(args.id).then(res => res);
    },
    messages() {
      return getAllMessages();
    },
    getMessagesByCategory(_parent, args) {
      return getMessagesByCategory(args.category).then(res => res);
    },
    getInbox() {
      return getInbox();
    },
    getOutbox() {
      return getOutbox();
    },
    getMessageCount() {
      return {
        msa: 5,
        rfq: 2,
        invoice: 3,
        purchaseorder: 4,
      };
    },
  },
  Mutation: {
    createMessage: async (_parent, args) => {
      const newMessage = await saveMessage(args.input);
      const message = newMessage.ops[0];
      pubsub.publish(NEW_MESSAGE, { newMessage: message });
      return { ...message };
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_MESSAGE);
      },
    },
  },
};
