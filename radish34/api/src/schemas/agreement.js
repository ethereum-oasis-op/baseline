import gql from 'graphql-tag';

// TODO nesting
const AgreementSchema = gql`
  extend type Query {
    agreement(id: String!): Agreement
    agreementsByName(name: String!): [Agreement]
    agreements: [Document]
    agreementsByLinkedId(linkedId: String!): [Agreement]
  }

  extend type Mutation {
    createAgreement(input: inputAgreement!): Agreement
  }

  extend type Subscription {
    newAgreement: Agreement
  }

  type Agreement {
    _id: String!
    zkpPublicKeyOfBuyer: String!
    zkpPublicKeyOfSupplier: String!
    name: String!
    description: String!
    erc20ContractAddress: String!
    commitments: [Commitment]!
    whisperPublicKeySupplier: String!
    buyerSignatureStatus: Boolean!
    supplierSignatureStatus: Boolean!
    supplierDetails: Partner,
    linkedId: String!
  }

  input inputAgreement {
    supplierAddress: String!
    name: String!
    description: String!
    erc20ContractAddress: String!
    linkedId: String!
  }
`;

export default AgreementSchema;
