import gql from 'graphql-tag';

const POSchema = gql`
  extend type Query {
    po(id: String!): PO
    poByMSAId(sku: String!): PO
    pos: [PO]
  }

  extend type Mutation {
    createPO(input: inputPO!): PO
  }

  input inputPO {
    msaId: String!
    volume: Int!
    description: String!
    deliveryDate: Int!
  }

  extend type Subscription {
    newPO: PO
  }

  type PO {
    _id: String!
    msaId: String
    whisperPublicKeyOfSupplier: String!
    constants: Constants
    commitments: [Commitment]
    metadata: Metadata
  }

  type Commitment {
    commitment: String!
    index: Int
    salt: String!
    nullifier: String
    variables: Variables
  }

  type Constants {
    zkpPublicKeyOfBuyer: String!
    zkpPublicKeyOfSupplier: String!
    volume: Int!
    price: Int!
    sku: String!
    erc20ContractAddress: String!
  }

  type Variables {
    accumulatedVolumeOrdered: Int!
    accumulatedVolumeDelivered: Int!
  }

  type Metadata {
    msaId: String!,
    open: Boolean,
    description: String!,
    deliveryDate: Int!,
    deliveries: [String!],
    invoices: [String!],
  }
`;

// NOTE: deliveries - array of deliveryId's
// NOTE: invoices - array of invoiceId's

export default POSchema;
