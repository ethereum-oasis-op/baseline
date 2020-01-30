import gql from 'graphql-tag';

export const MSA_ATTRIBUTES = gql`
  fragment MSA_ATTRIBUTES on MSA {
    _id
    rfpId
    proposalId
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
  query getMSAByProposal($proposalId: String!) {
    msaByProposal(proposalId: $proposalId) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_MSAS_BY_RFP = gql`
  query getMSAsByRFP($rfpId: String!) {
    msasByRFP(rfpId: $rfpId) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;
