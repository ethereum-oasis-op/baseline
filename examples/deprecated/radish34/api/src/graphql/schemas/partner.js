import gql from 'graphql-tag';

export default gql`
  extend type Query {
    partner(address: Address!): Partner
    partners: [Partner]
    myPartners: [Partner]
    getPartnerByMessagingKey(identity: String!): Partner
  }

  extend type Mutation {
    addPartner(input: AddPartnerInput!): PartnerPayload
    removePartner(input: RemovePartnerInput!): PartnerPayload
  }

  extend type Subscription {
    getPartnerUpdate: PartnerPayload
  }

  type Partner {
    address: Address!
    zkpPublicKey: String!
    identity: String!
    name: String!
    role: Role!
  }

  input AddPartnerInput {
    name: String
    address: Address
    role: Role
    identity: String!
    zkpPublicKey: String
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
