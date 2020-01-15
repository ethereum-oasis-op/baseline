import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { GET_SERVER_STATUS, GET_SERVER_STATUS_UPDATE } from '../graphql/server-status';

const ServerStatusContext = React.createContext([{}, () => {}]);
let statusListener;

const statusUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;
  const { serverStatusUpdate } = subscriptionData.data;
  return { prev, serverStatus: serverStatusUpdate };
}

const ServerStatusProvider = ({ children }) => {
  const {
    subscribeToMore: subscribeToStatusUpdates,
    data: initStatus,
    loading,
  } = useQuery(GET_SERVER_STATUS);

  useEffect(() => {
    if (!statusListener) {
      statusListener = subscribeToStatusUpdates({
        document: GET_SERVER_STATUS_UPDATE,
        updateQuery: statusUpdateQuery,
        fetchPolicy: 'no-cache',
      });
    }
  }, [subscribeToStatusUpdates]);

  const status = initStatus ? initStatus.serverStatus : {};

  return (
    <ServerStatusContext.Provider
      value={{
        status,
        loading,
      }}
    >
      {children}
    </ServerStatusContext.Provider>
  );
};

ServerStatusProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ServerStatusContext, ServerStatusProvider };
