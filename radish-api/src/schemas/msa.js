import gql from 'graphql-tag';

// TODO nesting
const MSASchema = gql`
  extend type Query {
    msa(id: Int!): MSA
    msaBySKU(sku: String!): MSA
    msas: [MSA]
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
    commitment: String!
    salt: String!
    accumulatedVolumeOrdered: Int!
    accumulatedVolumeDelivered: Int!
    whisperPublicKeySupplier: String!
    buyerSignatureStatus: Boolean!
    supplierSignatureStatus: Boolean!
  }

  input inputMSA {
    supplierAddress: String!
    tierBounds: [Int!]
    pricesByTier: [Int!]
    sku: String!
    erc20ContractAddress: String!
  }
`;

export default MSASchema;
