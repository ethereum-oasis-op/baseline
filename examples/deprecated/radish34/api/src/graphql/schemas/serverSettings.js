import gql from 'graphql-tag';

/**
TODO: Edit ServerSettings to be a nested object with 'organizations' and 'addresses' sub-objects, because it's neater. Will require a change to the UI. The backend has already been modified to allow this.
*/
export default gql`
  extend type Query {
    getServerSettings: ServerSettings
  }

  extend type Mutation {
    setRPCProvider(uri: String!): ServerSettings
    setOrgRegistryAddress(orgRegistryAddress: Address): ServerSettings
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
    orgRegistryAddress: Address
    organisationzkpPublicKey: String
    organisationzkpPrivateKey: String
  }
`;
