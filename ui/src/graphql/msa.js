import gql from 'graphql-tag';

const SIGNATURE_ATTRIBUTES = gql`
  fragment SIGNATURE_ATTRIBUTES on Signature {
    name
    signature
    signatureDate
  }
`

export const MSA_ATTRIBUTES = gql`
  fragment MSA_ATTRIBUTES on MSA {
    _id
    rfpId
    proposalId
    buyerSignature {
      name
      signature
      signatureDate
    }
    supplierSignature {
      name
      signature
      signatureDate
    }
  }
`;

export const GET_MSA_UPDATE = gql`
  subscription onNewMSA {
    newMSA {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_ALL_MSAS = gql`
  query getAllMSAs {
    msas {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const CREATE_MSA = gql`
  mutation createMSA($input: inputMSA!) {
    createMSA(input: $input) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_MSA_BY_PROPOSAL = gql`
  query getMSAByProposal($proposalId: Int!) {
    msaByProposal(proposalId: $proposalId) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`
