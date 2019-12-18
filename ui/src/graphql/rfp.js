import gql from 'graphql-tag';

export const RFP_ATTRIBUTES = gql`
  fragment RFP_ATTRIBUTES on RFP {
    _id
    description
    dateDeadline
    sku
    skuDescription
    suppliers
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
  query rfp($id: Int!) {
    rfp(id: $id) {
      ...RFP_ATTRIBUTES
    }
  }
  ${RFP_ATTRIBUTES}
`;
