import gql from 'graphql-tag';

export const QUOTE_ATTRIBUTES = gql`
  fragment QUOTE_ATTRIBUTES on Quote {
    _id
    rfqId
    terminationDate
    rates {
      volume
      ppu
    }
  }
`;

export const GET_QUOTE_UPDATE = gql`
  subscription onNewQuote {
    newQuote {
      ...QUOTE_ATTRIBUTES
    }
  }
  ${QUOTE_ATTRIBUTES}
`;

export const GET_ALL_QUOTES = gql`
  query getAllQuotes {
    quotes {
      ...QUOTE_ATTRIBUTES
    }
  }
  ${QUOTE_ATTRIBUTES}
`;

export const CREATE_QUOTE = gql`
  mutation createQuote($input: inputQuote!) {
    createQuote(input: $input) {
      ...QUOTE_ATTRIBUTES
    }
  }
  ${QUOTE_ATTRIBUTES}
`;
