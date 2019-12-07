import gql from 'graphql-tag';

export default gql`
  extend type Query {
    organization(address: Address!): Organization
    organizations: [Organization]
    organizationList(start: Int!, count: Int!): Organizations
    registeredOrganization(address: String!): RegisteredOrganization
    organizationCount: Int!
  }

  extend type Mutation {
    registerOrganization(input: RegisterOrganization!): OrganizationPayload
    registerToOrgRegistry(input: OrgRegistryInput!): RegisterToOrgRegistryPayload!
  }

  extend type Subscription {
    newOrganization: Organization
  }

  type Organization {
    name: String!
    address: Address!
    role: Role!
  }

  input RegisterOrganization {
    name: String!
    address: Address!
    role: Role!
  }

  type OrganizationPayload {
    organization: Organization
  }

  input OrgRegistryInput {
    address: Address!
    name: String!
    role: Int!
    key: String!
  }

  type RegisterToOrgRegistryPayload {
    transactionHash: String!
  }

  type RegisteredOrganization {
    address: String!
    name: String!
    role: Int!
    key: String!
  }

  type Organizations {
    addresses: [String!]!
    names: [String!]!
    roles: [Int!]!
    keys: [String!]!
  }
`;
