import {
  getNoticeById,
  getAllNotices,
  getNoticesByCategory,
  getInbox,
  getOutbox,
  saveNotice,
} from '../services/notice';
import { pubsub } from '../subscriptions';

const NEW_NOTICE = 'NEW_NOTICE';

export default {
  Query: {
    notice: async (_parent, args) => {
      const { id } = args;
      const res = await getNoticeById(id);
      return res;
    },
    notices: async () => {
      return getAllNotices();
    },
    getNoticesByCategory: async (_parent, args) => {
      const { category } = args;
      const res = await getNoticesByCategory(category);
      return res;
    },
    getInbox: async () => {
      return getInbox();
    },
    getOutbox: async () => {
      return getOutbox();
    },
    getNoticeCount: () => {
      return {
        msa: 5,
        rfp: 2,
        invoice: 3,
        purchaseorder: 4,
      };
    },
  },
  Mutation: {
    createNotice: async (_parent, args) => {
      const { input } = args;
      const newNotice = await saveNotice(input);
      const notice = newNotice.ops[0];
      pubsub.publish(NEW_NOTICE, { newNotice: notice });
      return { ...notice };
    },
  },
  Subscription: {
    newNotice: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_NOTICE);
      },
    },
  },
};
