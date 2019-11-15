import { pubsub } from '../subscriptions';
import { getServerState, setServerState } from '../utils/serverState';

const SERVER_STATE_UPDATE = 'SERVER_STATE_UPDATE';

export default {
  Query: {
    serverState: async (parent, args, context, info) => {
      const state = await getServerState();
      return { state };
    },
  },
  Mutation: {
    setState: async (root, args, context, info) => {
      const state = await setServerState(args.state);
      return { state };
    },
  },
  Subscription: {
    serverStateUpdate: {
      subscribe: (root, args, context) => {
        return pubsub.asyncIterator(SERVER_STATE_UPDATE);
      },
    },
  },
};
