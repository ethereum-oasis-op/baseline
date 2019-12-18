import gql from 'graphql-tag';

export const PROPOSAL_ATTRIBUTES = gql`
  fragment PROPOSAL_ATTRIBUTES on Proposal {
    _id
    rfpId
    terminationDate
    rates {
      startRange
      endRange
      ppu
    }
  }
`;

export const GET_PROPOSAL_UPDATE = gql`
  subscription onNewProposal {
    newProposal {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;

export const GET_ALL_PROPOSALS = gql`
  query getAllProposals {
    proposals {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;

export const CREATE_PROPOSAL = gql`
  mutation createProposal($input: inputProposal!) {
    createProposal(input: $input) {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;

export const GET_PROPOSAL = gql`
  query proposal($id: Int!) {
    proposal(id: $id) {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;
