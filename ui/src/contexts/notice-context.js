import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { NEW_NOTICE, GET_ALL_NOTICES } from '../graphql/notices';

const NoticeContext = React.createContext([{}, () => {}]);

const NoticeProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_NOTICES);
  const notices = data ? data.notices : [];

  useEffect(() => {
    subscribeToMore({
      document: NEW_NOTICE,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newNotice } = subscriptionData.data;
        return { notices: [newNotice, ...prev.notices] };
      },
    });
  }, [subscribeToMore]);

  return (
    <NoticeContext.Provider value={{ notices, loading, error }}>
      {children}
    </NoticeContext.Provider>
  );
};

NoticeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { NoticeContext, NoticeProvider };
