import {
  getMessageById,
  getAllMessages,
  getMessagesByCategory,
  getInbox,
  getOutbox,
  saveMessage,
} from '../services/message';
import { pubsub } from '../subscriptions';

const NEW_MESSAGE = 'NEW_MESSAGE';

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
        rfp: 2,
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
