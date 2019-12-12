import gql from 'graphql-tag';

const QuoteSchema = gql`
  extend type Query {
    quote(id: Int!): Quote
    quotes: [Quote]
  }

  extend type Mutation {
    createQuote(input: inputQuote!): Quote
  }

  extend type Subscription {
    newQuote: Quote
  }

  type Quote {
    _id: Int!
    rfqId: Int!
    rates: [RateTable!]!
    terminationDate: Date!
  }

  input inputQuote {
    rfqId: Int!
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

export default QuoteSchema;
