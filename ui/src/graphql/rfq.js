import gql from 'graphql-tag';

export const RFQ_ATTRIBUTES = gql`
  fragment RFQ_ATTRIBUTES on RFQ {
    _id
    name
    dateDeadline
    dateDelivery
    sku
    suppliers
    quantity
  }
`;

export const GET_RFQ_UPDATE = gql`
  subscription onNewRFQ {
    newRFQ {
      ...RFQ_ATTRIBUTES
    }
  }
  ${RFQ_ATTRIBUTES}
`;

export const GET_ALL_RFQS = gql`
  query getAllRFQs {
    rfqs {
      ...RFQ_ATTRIBUTES
    }
  }
  ${RFQ_ATTRIBUTES}
`;

export const CREATE_RFQ = gql`
  mutation createRFQ($input: inputRFQ!) {
    createRFQ(input: $input) {
      RFQ {
        ...RFQ_ATTRIBUTES
      }
    }
  }
`;
