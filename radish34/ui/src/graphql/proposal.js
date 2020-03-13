import gql from 'graphql-tag';

export const PROPOSAL_ATTRIBUTES = gql`
  fragment PROPOSAL_ATTRIBUTES on Proposal {
    _id
    rfpId
    rates {
      startRange
      endRange
      price
      unitOfMeasure
    }
    erc20ContractAddress
    sender
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

export const GET_PROPOSALS_BY_RFPID = gql`
  query proposal($rfpId: String!) {
    getProposalsByRFPId(rfpId: $rfpId) {
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
  query proposal($id: String!) {
    proposal(id: $id) {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;

export const GET_PROPOSAL_BY_RFP_AND_SUPPLIER = gql`
  query proposal($sender: String! $rfpId: String!) {
    getProposalByRFPAndSupplier(sender: $sender rfpId: $rfpId) {
      ...PROPOSAL_ATTRIBUTES
    }
  }
  ${PROPOSAL_ATTRIBUTES}
`;
