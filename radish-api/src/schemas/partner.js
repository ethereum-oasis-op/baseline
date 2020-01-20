import gql from 'graphql-tag';

export default gql`
  extend type Query {
    partner(address: Address!): Partner
    partners: [Partner]
    myPartners: [Partner]
    getPartnerByIdentity(identity: String!): Partner
  }

  extend type Mutation {
    addPartner(input: AddPartnerInput!): PartnerPayload
    removePartner(input: RemovePartnerInput!): PartnerPayload
  }

  extend type Subscription {
    getPartnerUpdate: PartnerPayload
  }

  type Partner {
    name: String!
    address: Address!
    role: Role!
    identity: String!
  }

  input AddPartnerInput {
    name: String!
    address: Address!
    role: Role!
    identity: String!
  }

  input RemovePartnerInput {
    name: String!
    address: Address!
    role: Role!
  }

  type PartnerPayload {
    partner: Partner
  }
`;
