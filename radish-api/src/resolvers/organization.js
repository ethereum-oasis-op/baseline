import db from '../db';

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
      await saveOrganization(args.input);
      const organization = await getOrganizationById(args.input.address);
      return { organization };
    },
  },
};
