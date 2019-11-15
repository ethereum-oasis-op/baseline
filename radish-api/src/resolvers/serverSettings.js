import { pubsub } from '../subscriptions';
import healthcheck from '../install/healthcheck';
import {
  setNetworkId,
  setOrganizationRegistryAddress,
  getServerSettings,
} from '../utils/serverSettings';

const SET_NETWORK_ID = 'SET_NETWORK_ID';
const SERVER_SETTINGS_UPDATE = 'SERVER_SETTINGS_UPDATE';

export default {
  Query: {
    async getServerSettings(parent, args, context, info) {
      const settings = await getServerSettings();
      console.log('Getting server settings', settings);
      return settings;
    },
  },
  Mutation: {
    setNetworkId: async (root, args, context, info) => {
      const settings = await setNetworkId(args.networkId);
      healthcheck();
      return settings;
    },
    setOrganizationRegistryAddress: async (root, args, context, info) => {
      const settings = await setOrganizationRegistryAddress(args.organizationRegistryAddress);
      healthcheck();
      return settings;
    },
  },
};
