import gql from 'graphql-tag';

export const GET_SERVER_STATE = gql`
  query GetServerState {
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
      globalRegistryAddress
      orgRegistryAddress
      organizationName
      organizationRole
      organizationAddress
      organizationWhisperKey
      rpcProvider
    }
  }
`;

export const GET_SERVER_SETTINGS_UPDATE = gql`
  subscription GetServerSettingsUpdate{
    serverSettingsUpdate {
      globalRegistryAddress
      orgRegistryAddress
      organizationName
      organizationRole
      organizationAddress
      organizationWhisperKey
      rpcProvider
    }
  }
`;

export const SET_RPC_PROVIDER = gql`
  mutation SetRPCProvider($uri: String!) {
    setRPCProvider(uri: $uri) {
      globalRegistryAddress
      orgRegistryAddress
      organizationName
      organizationRole
      organizationAddress
      organizationWhisperKey
      rpcProvider
    }
  }
`;


export const SET_WALLET_FROM_MNEMONIC = gql`
  mutation SetWalletFromMnemonic($mnemonic: String!, $path: String){
    setWalletFromMnemonic(mnemonic: $mnemonic, path: $path){
      globalRegistryAddress
      orgRegistryAddress
      organizationName
      organizationRole
      organizationWhisperKey
      rpcProvider
    }
  }
`;

export const REGISTER_ORGANIZATION = gql`
  mutation RegisterOrganization($input: RegisterOrganization!){
    registerOrganization(input: $input){
      organization {
        name
        address
        role
      }
    }
  }
`;
