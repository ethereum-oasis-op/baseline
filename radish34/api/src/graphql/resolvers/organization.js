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
import { logger } from 'radish34-logger';


const NEW_ORG = 'NEW_ORG';

export default {
  Query: {
    organization(_parent, args) {
      return getOrganizationById(args.address).then(res => res);
    },
    organizations() {
      return getAllOrganizations();
    },
    organizationList(_parent, args) {
      return listOrganizations(args.start, args.count);
    },
    registeredOrganization(_parent, args) {
      return getRegisteredOrganization(args.address);
    },
    organizationCount() {
      return getOrganizationCount();
    },
    orgRegistryAddress(_parent, args) {
      return getInterfaceAddress(args.registrarAddress, args.managerAddress, 'IOrgRegistry');
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

      const orgRegistryTxHash = await registerToOrgRegistry(
        organizationAddress,
        args.organizationName,
        args.organizationRole,
        organizationWhisperKey,
      );

      logger.info(`Registering organization with tx hash: ${orgRegistryTxHash}`, { service: 'API' });
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
