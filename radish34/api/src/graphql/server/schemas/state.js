import gql from 'graphql-tag';

export default gql`
  extend type Query {
    serverState: ServerState
  }

  extend type Mutation {
    setState(state: String!): ServerState
  }

  extend type Subscription {
    serverStateUpdate: ServerState
  }

  type ServerState {
    state: String
  }
`;
