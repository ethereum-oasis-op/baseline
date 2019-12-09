import gql from 'graphql-tag';

export const MESSAGE_ATTRIBUTES = gql`
  fragment MESSAGE_ATTRIBUTES on Message {
    _id
    resolved
    category
    subject
    from
    statusText
    lastModified
    status
    categoryId
  }
`;

export const CATEGORIES = gql`
  fragment CATEGORIES on MessageCount {
    msa
    invoice
    purchaseorder
    rfq
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

export const GET_MESSAGE_COUNT = gql`
  query getMessageCount {
    getMessageCount {
      ...CATEGORIES
    }
  }
  ${CATEGORIES}
`;
