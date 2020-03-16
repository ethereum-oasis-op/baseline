import gql from 'graphql-tag';

export default gql`
  extend type Query {
    organization(address: Address!): Organization
    organizations: [Organization]
    organizationList(start: Int!, count: Int!): Organizations
    registeredOrganization(address: Address!): RegisteredOrganization
    organizationCount: Int!
    orgRegistryAddress(registrarAddress: Address!, managerAddress: Address!): Address!
  }

  extend type Mutation {
    registerOrganization(input: RegisterOrganization!): OrganizationPayload
  }

  extend type Subscription {
    newOrganization: Organization
  }

  type Organization {
    name: String!
    address: Address!
    role: Int!
    identity: String!
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

  input RegisterOrganization {
    name: String!
    role: Int!
  }

  type OrganizationPayload {
    organization: Organization
  }

  type RegisterToOrgRegistryPayload {
    transactionHash: String!
  }

  type RegisteredOrganization {
    address: Address!
    name: String!
    role: Int!
    identity: String!
  }

  type Organizations {
    addresses: [Address!]!
    names: [String!]!
    roles: [Int!]!
    identities: [String!]!
  }
`;
