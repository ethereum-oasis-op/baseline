import { pubsub } from '../subscriptions';
import { withFilter } from '../../../node_modules/graphql-subscriptions';
const INCOMING_TOASTR_NOTIFICATION = 'INCOMING_TOASTR_NOTIFICATION';

export default {
  Subscription: {
    onNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(INCOMING_TOASTR_NOTIFICATION),
        (payload, variables) => payload.onNotification.userAddress === variables.userAddress
      ),
    },
  },
};

