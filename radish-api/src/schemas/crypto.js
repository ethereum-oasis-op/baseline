import gql from 'graphql-tag';

export default gql`
  extend type Query {
    myPublicKey: String!
    sign(hashInHex: String!): String!
    verifySignature(publicKey: String!, hashInHex: String!, signature: String!): String!
  }
`;
