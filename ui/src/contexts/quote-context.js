import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_QUOTE_UPDATE, GET_ALL_QUOTES, CREATE_QUOTE } from '../graphql/quote';

const QuoteContext = React.createContext([{}, () => {}]);

let listener;

const QuoteProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_QUOTES);
  const [postQuote] = useMutation(CREATE_QUOTE);
  const quotes = data ? data.quotes : [];

  useEffect(() => {
    if (!listener) {
      listener = subscribeToMore({
        document: GET_QUOTE_UPDATE,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newQuote } = subscriptionData.data;
          return { ...prev, quotes: [newQuote, ...prev.quotes] };
        },
      });
    }
  }, []);

  return (
    <QuoteContext.Provider value={{ quotes, loading, error, postQuote }}>{children}</QuoteContext.Provider>
  );
};

QuoteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { QuoteContext, QuoteProvider };
