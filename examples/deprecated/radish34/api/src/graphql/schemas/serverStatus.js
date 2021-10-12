import gql from 'graphql-tag';

export default gql`
  extend type Query {
    serverStatus: ServerStatus
  }

  extend type Subscription {
    serverStatusUpdate: ServerStatus
  }

  type ServerStatus {
    balance: Float
  }
`;
