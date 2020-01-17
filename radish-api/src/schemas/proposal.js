import gql from 'graphql-tag';

const ProposalSchema = gql`
  extend type Query {
    proposal(id: Int!): Proposal
    getProposalByRFPId(rfpId: String!): Proposal
    proposals: [Proposal]
  }

  extend type Mutation {
    createProposal(input: inputProposal!): Proposal
  }

  extend type Subscription {
    newProposal: Proposal
  }

  type Proposal {
    _id: Int!
    rfpId: String!
    rates: [RateTable!]!
  }

  input inputProposal {
    rfpId: String!
    rates: [inputRateTable!]!
  }

  type RateTable {
    startRange: Int!
    endRange: Int!
    price: Float!
    unitOfMeasure: String!
  }

  input inputRateTable {
    startRange: Int!
    endRange: Int!
    price: Float!
    unitOfMeasure: String!
  }
`;

export default ProposalSchema;
