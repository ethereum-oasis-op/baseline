import db from '../db';

/**
  query($address: String!){
    partner(address: $address) {
      address
      name
    }
  }
 */

export const typeDef = `
  extend type Query {
    partner(address: String!): Partner,
    partners: [Partner]
  }

  """
  A type that describes a partner
  """
  type Partner {
    "The partner's name"
    name: String,
    "the partner's ethereum address"
    address: String,
  }
`;

const getPartnerByID = async address => {
  const partner = await db
    .collection('partners')
    .find({ address: address })
    .toArray();
  return partner;
};

const getAllPartners = async () => {
  const partners = await db
    .collection('partners')
    .find({})
    .toArray();
  return partners;
};

export const resolvers = {
  Query: {
    partner(parent, args, context, info) {
      return getPartnerByID(args.address).then(res => res[0]);
    },
    partners(parent, args, context, info) {
      return getAllPartners();
    },
  },
  Partner: {
    name: root => root.name,
    address: root => root.address,
  },
};
