import gql from 'graphql-tag';

const RFQSchema = gql`
  extend type Query {
    rfq(id: Int!): RFQ
    rfqs: [RFQ]
  }

  extend type Mutation {
    createRFQ(input: inputRFQ!): RFQ
  }

  extend type Subscription {
    newRFQ: RFQ
  }

  type RFQ {
    _id: Int!
    description: String!
    dateDeadline: Date!
    sku: String!
    skuDescription: String!
    suppliers: [String!]!
  }

  input inputRFQ {
    description: String!
    dateDeadline: Date!
    sku: String!
    skuDescription: String!
    suppliers: [String!]!
  }
`;

export default RFQSchema;
