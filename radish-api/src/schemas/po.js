import gql from 'graphql-tag';

const POSchema = gql`
  extend type Query {
    po(id: Int!): PO
    poByMSAId(sku: String!): PO
    pos: [PO]
  }

  extend type Mutation {
    createPO(input: inputPO!): PO
  }

  input inputPO {
    msaId: String
    volume: Int!
  }

  extend type Subscription {
    newPO: PO
  }

  type PO {
    _id: Int!
    msaId: String
    whisperPublicKeyOfSupplier: String!
    constants: Constants
    commitments: Commitment
  }

  type Commitment {
    commitment: String!
    leafIndex: Int
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
`;

export default POSchema;
