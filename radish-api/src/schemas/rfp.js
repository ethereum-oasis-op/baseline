import gql from 'graphql-tag';

const RFPSchema = gql`
  extend type Query {
    rfp(id: Int!): RFP
    rfps: [RFP]
  }

  extend type Mutation {
    createRFP(input: inputRFP!): RFP
  }

  extend type Subscription {
    newRFP: RFP
  }

  type RFP {
    _id: Int!
    description: String!
    dateDeadline: Date!
    sku: String!
    skuDescription: String!
    suppliers: [String!]!
  }

  input inputRFP {
    description: String!
    dateDeadline: Date!
    sku: String!
    skuDescription: String!
    suppliers: [String!]!
  }
`;

export default RFPSchema;
