import gql from 'graphql-tag';

export default gql`
  extend type Query {
    contract(transactionHash: String!): SmartContract
    contracts: [SmartContract]
    transactionReceipt(hash: String!): TransactionReceipt
  }
  type SmartContract {
    contractAddress: String!
    contractName: String!
    contractOwner: String!
    transactionHash: String!
  }
  type TransactionReceipt {
    transactionHash: String!
    from: String!
    to: String
    status: String!
    blockNumber: Int!
    blockHash: String!
    confirmations: Int!
    gasUsed: Int!
    cumulativeGasUsed: Int!
    contractAddress: String
  }
`;
