import gql from 'graphql-tag';

export default gql`
  extend type Query {
    organization(address: Address!): Organization
    organizations: [Organization]
  }

  extend type Mutation {
    registerOrganization(input: RegisterOrganization!): OrganizationPayload
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
`;
