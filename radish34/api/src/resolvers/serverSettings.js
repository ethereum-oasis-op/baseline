import healthcheck from '../install/healthcheck';
import { pubsub } from '../subscriptions';
import { setRPCProvider, setContractAddress, getServerSettings } from '../utils/serverSettings';
import { createWalletFromMnemonic } from '../utils/wallet';

const SERVER_SETTINGS_UPDATE = 'SERVER_SETTINGS_UPDATE';

export default {
  Query: {
    async getServerSettings() {
      const { rpcProvider, organization, addresses } = await getServerSettings();
      console.log('Getting server settings:');
      console.log(rpcProvider);
      console.log(organization);
      console.log(addresses);
      // TODO: Edit ServerSettings graphQL schema to be a nested object with 'organizations' and 'addresses' sub-objects, to align with the radish-api backend.
      const {
        name: organizationName,
        role: organizationRole,
        messengerKey: organizationWhisperKey,
        address: organizationAddress
      } = organization;

      const {
        ERC1820Registry: globalRegistryAddress,
        OrgRegistry: orgRegistryAddress
      } = addresses;

      const flattenedSettings = {
        rpcProvider,
        organizationName,
        organizationRole,
        organizationWhisperKey,
        organizationAddress,
        globalRegistryAddress,
        orgRegistryAddress,
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
      const { mnemonic, path } = args;
      await createWalletFromMnemonic(mnemonic, path);
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
