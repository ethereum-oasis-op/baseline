import gql from 'graphql-tag';

export const MSA_ATTRIBUTES = gql`
  fragment MSA_ATTRIBUTES on MSA {
    _id
    rfpId
    proposalId
    buyerApproved
    supplierApproved
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
