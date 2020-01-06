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
    _id: String!
    description: String!
    sku: String!
    skuDescription: String!
    recipients: [Recipient!]!
    sender: String!
    onchainAttrs: OnChain!
    zkpAttrs: Zkp!
    proposalDeadline: Date!
    createdDate: Date!
    publishDate: Date!
    closedDate: Date!
  }

  input inputRFP {
    description: String!
    proposalDeadline: Date!
    sku: String!
    skuDescription: String!
    recipients: [InputRecipient!]!
  }

  input InputRecipient {
    partner: AddPartnerInput!
  }

  type Recipient {
    partner: Partner!
    receiptDate: Date
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
