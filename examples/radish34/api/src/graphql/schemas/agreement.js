import gql from 'graphql-tag';

// TODO nesting
const AgreementSchema = gql`
  extend type Query {
    agreement(id: String!): Agreement
    agreementsByName(name: String!): [Agreement]
    agreements: [Agreement]
    agreementsByPrevId(prevId: String!): [Agreement]
  }

  extend type Mutation {
    createAgreement(input: inputAgreement!): Agreement
  }

  extend type Subscription {
    newAgreement: Agreement
  }

  type AgreementCommitment {
    commitment: String!
    index: Int
    salt: String!
    nullifier: String
  }

  type Agreement {
    _id: String!
    zkpPublicKeyOfSender: String!
    zkpPublicKeyOfRecipient: String!
    name: String!
    description: String!
    erc20ContractAddress: String!
    commitments: [AgreementCommitment]!
    whisperPublicKeySupplier: String!
    senderSignatureStatus: Boolean!
    recipientSignatureStatus: Boolean!
    recipientDetails: Partner,
    prevId: String!
  }

  input inputAgreement {
    recipientAddress: String!
    name: String!
    description: String!
    erc20ContractAddress: String!
    prevId: String!
  }
`;

export default AgreementSchema;
