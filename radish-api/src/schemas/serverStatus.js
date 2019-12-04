import gql from 'graphql-tag';

export default gql`
  extend type Subscription {
    serverStatusUpdate: ServerStatus
  }

  type ServerStatus {
    balance: Float
  }

  type EthereumNetworkStatus {
    networkId: Int
    connected: Boolean
    organizationRegistryAddress: Address
  }

  type OrganizationStatus {
    name: String
    address: Address
    balance: Int
    role: String
  }

  type OrganizationBalance {
    balance: Int
  }
`;
