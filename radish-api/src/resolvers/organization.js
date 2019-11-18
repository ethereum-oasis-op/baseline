import { pubsub } from '../subscriptions';
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

const saveOrganization = async input => {
  const organization = await db
    .collection('organization')
    .updateOne({ _id: input.address }, { $set: input }, { upsert: true });
  return organization;
};

export default {
  Query: {
    organization(parent, args, context, info) {
      return getOrganizationById(args.address).then(res => res);
    },
    organizations(parent, args, context, info) {
      return getAllOrganizations();
    },
  },
  Organization: {
    name: root => root.name,
    address: root => root.address,
    role: root => root.role,
  },
  Mutation: {
    registerOrganization: async (root, args, context, info) => {
      // Alert API that a user is attempting to set up the Organization in the registry
      // Listen for the transaction on that contract to make sure that it goes through
      // Emits an event

      // When the event happens. It's going to take the current user's ETH address (0xc11)
      // Make this the first user (Admin user)

      await saveOrganization(args.input);
      const organization = await getOrganizationById(args.input.address);
      delete organization._id;
      pubsub.publish(NEW_ORG, {newOrganization: organization});
      return { organization };
    },
  },
  Subscription: {
    newOrganization: {
      subscribe: (root, args, context) => {
        return pubsub.asyncIterator(NEW_ORG);
      },
    },
  },
};
