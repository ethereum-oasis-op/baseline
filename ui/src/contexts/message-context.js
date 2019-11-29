import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { NEW_MESSAGE, GET_ALL_MESSAGES } from '../graphql/messages';

const MessageContext = React.createContext([{}, () => {}]);

const MessageProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_MESSAGES);
  const messages = data ? data.messages : [];

  useEffect(() => {
    subscribeToMore({
      document: NEW_MESSAGE,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newMessage } = subscriptionData.data;
        return { messages: [newMessage, ...prev.messages] };
      },
    });
  }, [subscribeToMore]);

  return (
    <MessageContext.Provider value={{ messages, loading, error }}>
      {children}
    </MessageContext.Provider>
  );
};

MessageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MessageContext, MessageProvider };
