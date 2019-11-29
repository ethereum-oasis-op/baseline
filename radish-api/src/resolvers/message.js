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
