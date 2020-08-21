import gql from 'graphql-tag';

// TODO nesting
const MSASchema = gql`
  extend type Query {
    msa(id: String!): MSA
    msasBySKU(sku: String!): [MSA]
    msas: [MSA]
    msasByRFPId(rfpId: String!): [MSA]
  }

  extend type Mutation {
    createMSA(input: inputMSA!): MSA
  }

  extend type Subscription {
    newMSA: MSA
  }

  type MSA {
    _id: String!
    zkpPublicKeyOfBuyer: String!
    zkpPublicKeyOfSupplier: String!
    tierBounds: [Int!]
    pricesByTier: [Int!]
    sku: String!
    erc20ContractAddress: String!
    hashOfTieredPricing: String!
    minVolume: Int!
    maxVolume: Int!
    commitments: [Commitment]!
    whisperPublicKeySupplier: String!
    buyerSignatureStatus: Boolean!
    supplierSignatureStatus: Boolean!
    supplierDetails: Partner,
    rfpId: String!
  }

  input inputMSA {
    supplierAddress: String!
    tierBounds: [Int!]
    pricesByTier: [Int!]
    sku: String!
    erc20ContractAddress: String!
    rfpId: String!
  }
`;

export default MSASchema;
