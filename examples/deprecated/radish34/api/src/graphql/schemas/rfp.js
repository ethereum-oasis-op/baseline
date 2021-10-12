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
    sender: String
    onchainAttrs: OnChain!
    zkpAttrs: Zkp!
    proposalDeadline: Int!
    createdDate: Int!
    publishDate: Int!
    closedDate: Int!
  }

  input inputRFP {
    description: String!
    proposalDeadline: Int!
    sku: String!
    skuDescription: String!
    recipients: [InputRecipient!]!
  }

  input InputRecipient {
    partner: AddPartnerInput!
  }

  type Recipient {
    partner: Partner!
    origination: Origination
    signature: RFPSignature
  }

  type Origination {
    messageId: String
    receiptDate: Int
  }

  type RFPSignature{
    sentDate: Int
    receivedDate: Int
    messageId: String
  }

  type OnChain {
    rfpAddress: String!
    txHash: String!
    rfpId: String!
  }

  type Zkp {
    proof: String!
    verificationKey: String!
    verifierABI: String!
  }
`;

export default RFPSchema;
