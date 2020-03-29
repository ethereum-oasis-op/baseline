// import healthcheck from '../../install/healthcheck';
import { pubsub } from '../../subscriptions';
import { getServerSettings, setServerSetting } from '../../../db/models/baseline/server/settings';
import { createWalletFromMnemonic } from '../../../wallet';

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
      const { uri } = args.uri;
      const rpcProvider = uri;
      const settings = await setServerSetting('rpcProvider', rpcProvider);
      return settings;
    },
    setOrganizationRegistryAddress: async (_parent, args) => {
      const { organizationRegistryAddress } = args;
      const settings = await setServerSetting('organizationRegistryAddress', organizationRegistryAddress);
      return settings;
    },
    setWalletFromMnemonic: async (_parent, args) => {
      const { mnemonic, path } = args;
      await createWalletFromMnemonic(mnemonic, path);
      // healthcheck();
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
