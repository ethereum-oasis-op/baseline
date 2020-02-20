import gql from 'graphql-tag';

export default gql`
  extend type Query {
    getServerSettings: ServerSettings
  }

  extend type Mutation {
    setRPCProvider(uri: String!): ServerSettings
    setOrganizationRegistryAddress(organizationRegistryAddress: Address): ServerSettings
    setWalletFromMnemonic(mnemonic: String!, path: String): ServerSettings
  }

  extend type Subscription {
    serverSettingsUpdate: ServerSettings
  }

  type ServerSettings {
    rpcProvider: String
    organizationName: String
    organizationRole: Int
    organizationWhisperKey: String
    organizationAddress: String
    globalRegistryAddress: Address
    organizationRegistryAddress: Address
  }
`;
