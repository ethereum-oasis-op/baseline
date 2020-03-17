import gql from 'graphql-tag';

export const GET_ALL_ORGANIZATIONS = gql`
  query {
    organizations {
      name
      address
      role
      identity
      isPartner
    }
    partners {
      name
      address
      role
      identity
      isPartner
    }
  }
`;

export const GET_PARTNERS = gql`
  query {
    partners {
      name
      address
      role
      identity
      isPartner
    }
  }
`;

export const GET_ALLPARTNERS_QUERY = gql`
  query {
    organizations {
      name
      address
      role
      identity
      zkpPublicKey
      isPartner
    }

    partners {
      name
      address
      role
      identity
      zkpPublicKey
      isPartner
    }
  }
`;

export const ORGANIZATION_PARTNER_LIST_UPDATE = gql`
  subscription OrganizationPartnerListUpdate {
    organizationPartnerListUpdate {
      organizations {
        name
        address
        role
        identity
        zkpPublicKey
        isPartner
      }

      partners {
        name
        address
        role
        identity
        zkpPublicKey
        isPartner
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
      isPartner
    }
  }
`;

export const GET_MYPARTNERS_QUERY = gql`
  query myPartners {
    name
    address
    role
    identity
    isPartner
  }
`;

export const ADD_PARTNER = gql`
  mutation addPartner($input: AddPartnerInput!) {
    addPartner(input: $input) {
      partner {
        address
      }
    }
  }
`;

export const REMOVE_PARTNER = gql`
  mutation removePartner($input: RemovePartnerInput!) {
    removePartner(input: $input) {
      partner {
        address
      }
    }
  }
`;

export const GET_PARTNER_BY_IDENTITY = gql`
  query($identity: String!) {
    partner: getPartnerByIdentity(identity: $identity) {
      name
      address
      role
      identity
      zkpPublicKey
    }
  }
`;
