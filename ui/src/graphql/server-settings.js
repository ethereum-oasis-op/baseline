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
      organization {
        messengerKey
        name
        role
        zkpPublicKey
        zkpPrivateKey
      }
      addresses {
        ERC1820Registry
        OrgRegistry
        BN256G2
        Verifier
        Shield
      }
      rpcProvider
    }
  }
`;

export const GET_SERVER_SETTINGS_UPDATE = gql`
  subscription GetServerSettingsUpdate {
    serverSettingsUpdate {
      organization {
        messengerKey
        name
        role
        zkpPublicKey
        zkpPrivateKey
      }
      addresses {
        ERC1820Registry
        OrgRegistry
        BN256G2
        Verifier
        Shield
      }
      rpcProvider
    }
  }
`;

export const SET_RPC_PROVIDER = gql`
  mutation SetRPCProvider($uri: String!) {
    setRPCProvider(uri: $uri) {
      organization {
        messengerKey
        name
        role
        zkpPublicKey
        zkpPrivateKey
      }
      addresses {
        ERC1820Registry
        OrgRegistry
        BN256G2
        Verifier
        Shield
      }
      rpcProvider
    }
  }
`;

export const SET_WALLET_FROM_MNEMONIC = gql`
  mutation SetWalletFromMnemonic($mnemonic: String!, $path: String) {
    setWalletFromMnemonic(mnemonic: $mnemonic, path: $path) {
      organization {
        messengerKey
        name
        role
        zkpPublicKey
        zkpPrivateKey
      }
      addresses {
        ERC1820Registry
        OrgRegistry
        BN256G2
        Verifier
        Shield
      }
      rpcProvider
    }
  }
`;

export const REGISTER_ORGANIZATION = gql`
  mutation RegisterOrganization($input: RegisterOrganization!) {
    registerOrganization(input: $input) {
      organization {
        name
        address
        role
      }
    }
  }
`;
