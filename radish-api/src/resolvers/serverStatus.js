import { pubsub } from '../subscriptions';

const SERVER_STATUS_UPDATE = 'SERVER_STATUS_UPDATE';

export default {
  Subscription: {
    serverStatusUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(SERVER_STATUS_UPDATE);
      },
    },
  },
};
