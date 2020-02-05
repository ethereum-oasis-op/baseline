import gql from 'graphql-tag';

const ToastrSchema = gql`
  extend type Subscription {
    onNotification(userAddress: Address!): Notification
  }

  type Notification {
    success: Boolean!
    message: String!
  }
`

export default ToastrSchema;
