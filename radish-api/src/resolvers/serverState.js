import { pubsub } from '../subscriptions';
import { getServerState, setServerState } from '../utils/serverState';

const SERVER_STATE_UPDATE = 'SERVER_STATE_UPDATE';

export default {
  Query: {
    serverState: async () => {
      const state = await getServerState();
      return { state };
    },
  },
  Mutation: {
    setState: async (_parent, args) => {
      const state = await setServerState(args.state);
      return { state };
    },
  },
  Subscription: {
    serverStateUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(SERVER_STATE_UPDATE);
      },
    },
  },
};
