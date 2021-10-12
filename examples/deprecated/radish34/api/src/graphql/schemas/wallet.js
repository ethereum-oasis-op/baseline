import gql from 'graphql-tag';

export default gql`
  extend type Query {
    myWalletBalance: Float!
    myWalletAddress: Address!
  }
`;
