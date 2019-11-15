import gql from 'graphql-tag';

export default gql`
  extend type Query {
    partner(address: Address!): Organization
    "return all of the partners from the registry contract"
    partners: [Organization]
    "return the ones that are saved as a preference for the API"
    myPartners: [Partner]
  }

  extend type Mutation {
    addPartner (input: AddPartnerInput!): PartnerPayload
    removePartner (input: RemovePartnerInput!): PartnerPayload
  }

  type Partner {
    name: String!
    address: Address!
    role: Role!
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
