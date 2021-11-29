import gql from 'graphql-tag';

const NoticeSchema = gql`
  extend type Query {
    notice(id: Int!): Notice
    notices: [Notice]
    getNoticesByCategory(category: String!): [Notice]
    getInbox: [Notice]
    getOutbox: [Notice]
    getNoticeCount: NoticeCount
  }

  extend type Mutation {
    createNotice(input: inputNotice!): Notice
  }

  extend type Subscription {
    newNotice: Notice
  }

  type Notice {
    _id: String!
    categoryId: String!
    resolved: Boolean!
    category: String!
    subject: String!
    from: String!
    statusText: String!
    lastModified: Int!
    status: String!
  }

  input inputNotice {
    resolved: Boolean!
    categoryId: Int!
    category: String!
    subject: String!
    from: String!
    statusText: String!
    lastModified: Int!
    status: String!
  }

  type NoticeCount {
    msa: Int!
    rfp: Int!
    invoice: Int!
    purchaseorder: Int!
  }
`;

export default NoticeSchema;
