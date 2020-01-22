import gql from 'graphql-tag';

export default gql`
  extend type Query {
    myWalletBalance: Float!
    myWalletAddress: Address!
    myPublicKey: String!
    signature(hashInHex: String!): String!
    signatureVerification(publicKey: String!, hashInHex: String!, signature: String!): String!
  }
`;
