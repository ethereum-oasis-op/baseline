import healthcheck from '../install/healthcheck';
import { pubsub } from '../subscriptions';
import { setRPCProvider, setContractAddress, getServerSettings } from '../utils/serverSettings';
import { createWalletFromMnemonic } from '../utils/wallet';
import { logger } from 'radish34-logger';

const SERVER_SETTINGS_UPDATE = 'SERVER_SETTINGS_UPDATE';

export default {
  Query: {
    async getServerSettings() {
      const { rpcProvider, organization, addresses } = await getServerSettings();
      logger.info(`
        Getting server settings:
        rpcProvider: ${rpcProvider}
        organization: ${organization}
        addresses: ${addresses}
      `, { service: 'API' });
      // TODO: Edit ServerSettings graphQL schema to be a nested object with 'organizations' and 'addresses' sub-objects, to align with the radosh-api backend.
      const flattenedSettings = {
        rpcProvider,
        organizationName: organization.name,
        organizationRole: organization.role,
        organizationWhisperKey: organization.messengerKey,
        organizationAddress: organization.address,
        globalRegistryAddress: addresses.ERC1820Registry,
        orgRegistryAddress: addresses.OrgRegistry,
      };
      return flattenedSettings;
    },
  },
  Mutation: {
    setRPCProvider: async (_parent, args) => {
      await setRPCProvider(args.uri);
      healthcheck();
      const settings = await getServerSettings();
      return settings;
    },
    setOrgRegistryAddress: async (_parent, args) => {
      await setContractAddress('OrgRegistry', args.orgRegistryAddress);
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
