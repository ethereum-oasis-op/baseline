import gql from 'graphql-tag';

const AgreementSchema = gql`
  extend type Query {
    agreement(id: Int!): Agreement
    agreementByLinkedId(linkedId: String!): Agreement
    agreements: [Agreement]
  }

  extend type Mutation {
    createAgreement(input: inputAgreement!): Agreement
  }

  extend type Subscription {
    newAgreement: Agreement
  }

  type Agreement {
    _id: Int!
    linkedId: String!
    buyerSignature: Signature
    supplierSignature: Signature
  }

  input inputAgreement {
    linkedId: String!
    buyerSignature: inputSignature,
  }

  type Signature {
    name: String!
    signature: String!
    signatureDate: Date!
  }

  input inputSignature {
    name: String!
    signature: String!
    signatureDate: Date!
  }
`;

export default AgreementSchema;
