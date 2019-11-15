import gql from 'graphql-tag';

export const GET_SERVER_STATE = gql`
  query GetServerState{
    serverState {
      state
    }
  }
`;

export const GET_SERVER_STATE_UPDATE = gql`
  subscription onServerStateUpdate {
    serverStateUpdate {
      state
    }
  }
`;

export const GET_SERVER_SETTINGS = gql`
  query GetServerSettings {
    getServerSettings {
      networkId
      organizationRegistryAddress
    }
  }
`;

export const SET_NETWORK_ID = gql`
  mutation SetNetworkId($networkId: Int!){
    setNetworkId(networkId: $networkId){
      networkId
      organizationRegistryAddress
    }
  }
`;

export const SET_ORGANIZATION_REGISTRY_ADDRESSS = gql`
  mutation SetOrganizationRegistryAddress($organizationRegistryAddress: Address!){
    setOrganizationRegistryAddress(organizationRegistryAddress: $organizationRegistryAddress){
      networkId
      organizationRegistryAddress
    }
  }
`;

export const GET_SERVER_STATUS_UPDATE = gql`
  subscription onServerStateUpdate {
    serverStatusUpdate {
      balance
    }
  }
`;
