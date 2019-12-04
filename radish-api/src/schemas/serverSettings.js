import gql from 'graphql-tag';

export default gql`
  extend type Query {
    getServerSettings: ServerSettings
  }

  extend type Mutation {
    setNetworkId(networkId: String!): ServerSettings
    setOrganizationRegistryAddress(organizationRegistryAddress: Address): ServerSettings
  }

  type ServerSettings {
    networkId: String
    organizationRegistryAddress: Address
  }
`;
