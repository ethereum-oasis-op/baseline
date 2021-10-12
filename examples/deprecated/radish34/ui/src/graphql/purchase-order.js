import gql from 'graphql-tag';

export const PO_ATTRIBUTES = gql`
fragment PO_ATTRIBUTES on PO {
  _id
  whisperPublicKeyOfSupplier
  constants {
    zkpPublicKeyOfBuyer
    zkpPublicKeyOfSupplier
    volume
    price
    sku
    erc20ContractAddress
  }
  commitments {
    commitment
    index
    salt
    nullifier
    variables {
      accumulatedVolumeDelivered
    }
  }
  metadata {
    msaId
    description
    deliveryDate
  }
}
`;


export const CREATE_PURCHASE_ORDER = gql`
  mutation createPO($input: inputPO!) {
    createPO(input: $input) {
      _id
    }
  }
`;

export const GET_ALL_PURCHAS_ORDERS = gql`
  query pos {
    ...PO_ATTRIBUTES
  }
  ${PO_ATTRIBUTES}
`;

export const GET_PURCHASE_ORDER = gql`
  query po($id: String!) {
    po(id: $id) {
      ...PO_ATTRIBUTES
    }
  }
  ${PO_ATTRIBUTES}
`;
