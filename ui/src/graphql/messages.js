import gql from 'graphql-tag';

export const MESSAGE_ATTRIBUTES = gql`
  fragment MESSAGE_ATTRIBUTES on Message {
    _id
    new
    category
    subject
    from
    status
    lastModified
  }
`;

export const NEW_MESSAGE = gql`
  subscription onNewMessage {
    newMessage {
      ...MESSAGE_ATTRIBUTES
    }
  }
  ${MESSAGE_ATTRIBUTES}
`;

export const GET_ALL_MESSAGES = gql`
  query getAllMessages {
    messages {
      ...MESSAGE_ATTRIBUTES
    }
  }
  ${MESSAGE_ATTRIBUTES}
`;
