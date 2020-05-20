// import healthcheck from '../../install/healthcheck';
import { pubsub } from '../../subscriptions';
import { getServerSettings, setServerSetting } from '../../../db/models/baseline/server/settings';
import { createWalletFromMnemonic } from '../../../wallet';
import { logger } from 'radish34-logger';

const SERVER_SETTINGS_UPDATE = 'SERVER_SETTINGS_UPDATE';

export default {
  Query: {
    async getServerSettings() {
      const settings = await getServerSettings();
      logger.info('Getting server settings\n%o', settings, { service: 'API' });
      return settings;
    },
  },
  Mutation: {
    setRPCProvider: async (_parent, args) => {
      const rpcProvider = args.uri;
      const settings = await setServerSetting('rpcProvider', rpcProvider);
      return settings;
    },
    setOrganizationRegistryAddress: async (_parent, args) => {
      const { organizationRegistryAddress } = args;
      const settings = await setServerSetting('organizationRegistryAddress', organizationRegistryAddress);
      return settings;
    },
    setWalletFromMnemonic: async (_parent, args) => {
      await createWalletFromMnemonic(args.mnemonic, args.path);
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
