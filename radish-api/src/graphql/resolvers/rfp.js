import { getRFPById, getAllRFPs } from '../../db/models/modules/rfps';
import { pubsub } from '../subscriptions';

const NEW_RFP = 'NEW_RFP';

export default {
  Query: {
    rfp(_parent, args) {
      return getRFPById(args.uuid).then(res => res);
    },
    rfps() {
      return getAllRFPs();
    },
  },
  Mutation: {
    // TODO: Connect this to the new baseline function 'createRFP'
    createRFP: async (_parent, args, context) => {},
  },
  Subscription: {
    newRFP: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_RFP);
      },
    },
  },
};
