import gql from 'graphql-tag';

export const GET_ALLPARTNERS_QUERY = gql`
  query {
    organizations {
      name
      address
      role
      identity
    }

    myPartners {
      name
      address
      role
      identity
    }
  }
`;

export const GET_PARTNER_UPDATE = gql`
  subscription GetPartnerUpdate {
    getPartnerUpdate {
      organizations {
        name
        address
        role
        identity
      }

      myPartners {
        name
        address
        role
        identity
      }
    }
  }
`;

export const GET_PARTNER_QUERY = gql`
  query partner($address: Address!) {
    partner {
      name
      address
      role
      identity
    }
  }
`;

export const GET_MYPARTNERS_QUERY = gql`
  query myPartners {
    name
    address
    role
    identity
  }
`;

export const ADD_PARTNER = gql`
  mutation addPartner($input: AddPartnerInput!) {
    addPartner(input: $input) {
      partner {
        name
        address
        role
        identity
      }
    }
  }
`;

export const REMOVE_PARTNER = gql`
  mutation removePartner($input: RemovePartnerInput!) {
    removePartner(input: $input) {
      partner {
        name
        address
        role
      }
    }
  }
`;

export const GET_PARTNER_BY_IDENTITY = gql`
  query($identity: String!) {
    getPartnerByIdentity(identity: $identity) {
      name
      address
      role
      identity
    }
  }
`;
