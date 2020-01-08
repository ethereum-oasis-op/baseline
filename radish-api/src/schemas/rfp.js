import gql from 'graphql-tag';

const RFPSchema = gql`
  extend type Query {
    rfp(uuid: String!): RFP
    rfps: [RFP]
  }

  extend type Mutation {
    createRFP(input: inputRFP!): RFP
  }

  extend type Subscription {
    newRFP: RFP
  }

  type RFP {
    _id: String!
    description: String!
    sku: String!
    skuDescription: String!
    recipients: [Recipient!]!
    sender: String!
    onchainAttrs: OnChain!
    zkpAttrs: Zkp!
    dateDeadline: Int!
    createdDate: Int!
    publishDate: Int!
    closedDate: Int!
  }

  input inputRFP {
    description: String!
    dateDeadline: Int!
    sku: String!
    skuDescription: String!
    recipients: [inputRecipient!]!
  }

  input inputRecipient {
    identity: String!
  }

  type Recipient {
    identity: String!
    receiptDate: Int!
  }
  
  type OnChain {
    rfpAddress: String!
    txHash: String!
    rfpId: Int!
  }
  
  type Zkp {
    proof: String!
    verificationKey: String!
    verifierABI: String!
  }
`;

export default RFPSchema;
