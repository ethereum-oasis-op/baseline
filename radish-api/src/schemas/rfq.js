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
    name: String!
    dateDeadline: Int!
    dateDelivery: Int!
    sku: String!
    suppliers: [Int]
    quantity: Int
  }

  input inputRFQ {
    name: String!
    dateDeadline: Int!
    dateDelivery: Int!
    sku: String!
    suppliers: [Int]
    quantity: Int
  }
`;

export default RFQSchema;
