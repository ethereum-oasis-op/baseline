import gql from 'graphql-tag';

const MessageSchema = gql`
  extend type Query {
    message(id: Int!): Message
    messages: [Message]
  }

  extend type Mutation {
    createMessage(input: inputMessage!): Message
  }

  extend type Subscription {
    newMessage: Message
  }

  type Message {
    _id: String!
    new: Boolean!
    category: String!
    subject: String!
    from: String!
    lastModified: Int!
    status: String!
  }

  input inputMessage {
    new: Boolean!
    category: String!
    subject: String!
    from: String!
    lastModified: Int!
    status: String!
  }
`;

export default MessageSchema;
