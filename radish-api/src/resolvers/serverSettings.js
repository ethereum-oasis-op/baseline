import healthcheck from '../install/healthcheck';
import { pubsub } from '../subscriptions';
import {
  setRPCProvider,
  setOrganizationRegistryAddress,
  getServerSettings,
} from '../utils/serverSettings';
import { createWalletFromMnemonic } from '../utils/wallet';

const SERVER_SETTINGS_UPDATE = 'SERVER_SETTINGS_UPDATE';

export default {
  Query: {
    async getServerSettings() {
      const settings = await getServerSettings();
      console.log('Getting server settings', settings);
      return settings;
    },
  },
  Mutation: {
    setRPCProvider: async (_parent, args) => {
      await setRPCProvider(args.uri);
      healthcheck();
      const settings = await getServerSettings();
      return settings;
    },
    setOrganizationRegistryAddress: async (_parent, args) => {
      await setOrganizationRegistryAddress(args.organizationRegistryAddress);
      healthcheck();
      const settings = await getServerSettings();
      return settings;
    },
    setWalletFromMnemonic: async (_parent, args) => {
      await createWalletFromMnemonic(args.mnemonic, args.path);
      healthcheck();
      const settings = await getServerSettings();
      return settings;
    },
  },
  Subscription: {
    serverSettingsUpdate: {
      subscribe: () => {
        return pubsub.asyncIterator(SERVER_SETTINGS_UPDATE);
      },
    },
  },
};
