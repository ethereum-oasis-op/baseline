import gql from 'graphql-tag';

const ProposalSchema = gql`
  extend type Query {
    proposal(id: Int!): Proposal
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
    rfpId: Int!
    rates: [RateTable!]!
    terminationDate: Date!
  }

  input inputProposal {
    rfpId: Int!
    rates: [inputRateTable!]!
    terminationDate: Date!
  }

  type RateTable {
    startRange: Int!
    endRange: Int!
    ppu: Float!
  }

  input inputRateTable {
    startRange: Int!
    endRange: Int!
    ppu: Float!
  }
`;

export default ProposalSchema;
