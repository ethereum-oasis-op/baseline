import healthcheck from '../install/healthcheck';
import {
  setNetworkId,
  setOrganizationRegistryAddress,
  getServerSettings,
} from '../utils/serverSettings';

export default {
  Query: {
    async getServerSettings() {
      const settings = await getServerSettings();
      console.log('Getting server settings', settings);
      return settings;
    },
  },
  Mutation: {
    setNetworkId: async (_parent, args) => {
      const settings = await setNetworkId(args.networkId);
      healthcheck();
      return settings;
    },
    setOrganizationRegistryAddress: async (_parent, args) => {
      const settings = await setOrganizationRegistryAddress(args.organizationRegistryAddress);
      healthcheck();
      return settings;
    },
  },
};
