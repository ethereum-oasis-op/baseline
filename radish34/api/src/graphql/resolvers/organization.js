import { pubsub } from '../subscriptions';
import { getInterfaceAddress } from '../../contracts/ERC1820Registry/methods';
import { getServerSettings } from '../../db/models/baseline/server/settings';
import { getOrganizationById, getAllOrganizations } from '../../db/models/baseline/organizations';
import {
  registerToOrgRegistry,
  listOrganizations,
  getOrganizationCount,
  getRegisteredOrganization,
} from '../../contracts/OrgRegistry/methods';

const NEW_ORG = 'NEW_ORG';

export default {
  Query: {
    async organization(_parent, args) {
      const { address } = args;
      const res = await getOrganizationById(address);
      return res;
    },
    organizations() {
      return getAllOrganizations();
    },
    organizationList(_parent, args) {
      const { start, count } = args;
      return listOrganizations(start, count);
    },
    registeredOrganization(_parent, args) {
      const { address } = args;
      return getRegisteredOrganization(address);
    },
    organizationCount() {
      return getOrganizationCount();
    },
    orgRegistryAddress(_parent, args) {
      const { registrarAddress, managerAddress } = args;
      return getInterfaceAddress(registrarAddress, managerAddress, 'IOrgRegistry');
    },
  },
  Organization: {
    name: root => root.name,
    address: root => root.address,
    role: root => root.role,
  },
  Mutation: {
    registerOrganization: async (_root, args) => {
      const settings = await getServerSettings();
      const { organizationWhisperKey, organizationAddress } = settings;
      const { organizationName, organizationRole } = args;

      const orgRegistryTxHash = await registerToOrgRegistry(
        organizationAddress,
        organizationName,
        organizationRole,
        organizationWhisperKey,
      );

      console.log('Registering Organization with tx:', orgRegistryTxHash);
    },
  },
  Subscription: {
    newOrganization: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_ORG);
      },
    },
  },
};
