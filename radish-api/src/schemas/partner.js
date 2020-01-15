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
