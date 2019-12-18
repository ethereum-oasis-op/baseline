import gql from 'graphql-tag';

const MessageSchema = gql`
  extend type Query {
    message(id: Int!): Message
    messages: [Message]
    getMessagesByCategory(category: String!): [Message]
    getInbox: [Message]
    getOutbox: [Message]
    getMessageCount: MessageCount
  }

  extend type Mutation {
    createMessage(input: inputMessage!): Message
  }

  extend type Subscription {
    newMessage: Message
  }

  type Message {
    _id: String!
    categoryId: Int!
    resolved: Boolean!
    category: String!
    subject: String!
    from: String!
    statusText: String!
    lastModified: Date!
    status: String!
  }

  input inputMessage {
    resolved: Boolean!
    categoryId: Int!
    category: String!
    subject: String!
    from: String!
    statusText: String!
    lastModified: Date!
    status: String!
  }

  type MessageCount {
    msa: Int!
    rfp: Int!
    invoice: Int!
    purchaseorder: Int!
  }
`;

export default MessageSchema;
