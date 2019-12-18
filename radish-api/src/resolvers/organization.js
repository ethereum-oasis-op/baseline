import { pubsub } from '../subscriptions';
import {
  registerToOrgRegistry,
  listOrganizations,
  getRegisteredOrganization,
  getOrganizationCount,
  getInterfaceAddress,
  saveOrganization,
} from '../services/organization';
import db from '../db';

const NEW_ORG = 'NEW_ORG';

const getOrganizationById = async address => {
  const organization = await db.collection('organization').findOne({ _id: address });
  return organization;
};

const getAllOrganizations = async () => {
  const organizations = await db
    .collection('organization')
    .find({})
    .toArray();
  return organizations;
};

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
      // Alert API that a user is attempting to set up the Organization in the registry
      // Listen for the transaction on that contract to make sure that it goes through
      // Emits an event

      // When the event happens. It's going to take the current user's ETH address (0xc11)
      // Make this the first user (Admin user)

      await saveOrganization(args.input);
      const organization = await getOrganizationById(args.input.address);
      delete organization._id;
      pubsub.publish(NEW_ORG, { newOrganization: organization });
      return { organization };
    },
    registerToOrgRegistry: async (root, args) => {
      const transactionHash = registerToOrgRegistry(
        args.input.address,
        args.input.name,
        args.input.role,
        args.input.key,
      );
      return transactionHash;
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
