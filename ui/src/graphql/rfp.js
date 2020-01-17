import gql from 'graphql-tag';

export const RFP_ATTRIBUTES = gql`
  fragment RFP_ATTRIBUTES on RFP {
    _id
    description
    proposalDeadline
    sku
    skuDescription
    sender
    recipients {
      partner {
        identity
        name
        address
        role
      }
    }
  }
`;

export const GET_RFP_UPDATE = gql`
  subscription onNewRFP {
    newRFP {
      ...RFP_ATTRIBUTES
    }
  }
  ${RFP_ATTRIBUTES}
`;

export const GET_ALL_RFPS = gql`
  query getAllRFPs {
    rfps {
      ...RFP_ATTRIBUTES
    }
  }
  ${RFP_ATTRIBUTES}
`;

export const CREATE_RFP = gql`
  mutation createRFP($input: inputRFP!) {
    createRFP(input: $input) {
      ...RFP_ATTRIBUTES
    }
  }
  ${RFP_ATTRIBUTES}
`;

export const GET_RFP = gql`
  query rfp($uuid: String!) {
    rfp(uuid: $uuid) {
      ...RFP_ATTRIBUTES
    }
  }
  ${RFP_ATTRIBUTES}
`;
