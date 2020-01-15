import gql from 'graphql-tag';

const MSASchema = gql`
  extend type Query {
    msa(id: Int!): MSA
    msaByProposal(proposalId: Int!): MSA
    msas: [MSA]
  }

  extend type Mutation {
    createMSA(input: inputMSA!): MSA
  }

  extend type Subscription {
    newMSA: MSA
  }

  type MSA {
    _id: Int!
    proposalId: Int!
    rfpId: Int!
    buyerSignature: Signature
    supplierSignature: Signature
  }

  input inputMSA {
    proposalId: Int!
    rfpId: Int!
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

export default MSASchema;
