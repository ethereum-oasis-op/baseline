import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useSubscription } from '@apollo/react-hooks';

const ServerStatusContext = React.createContext([{}, () => {}]);

const GET_SERVER_STATUS_UPDATE = gql`
  subscription onServerStateUpdate {
    serverStatusUpdate {
      balance
    }
  }
`;

const ServerStatusProvider = ({ children }) => {
  const { loading, data } = useSubscription(GET_SERVER_STATUS_UPDATE);

  return (
    <ServerStatusContext.Provider value={[data, loading]}>{children}</ServerStatusContext.Provider>
  );
};

ServerStatusContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ServerStatusContext, ServerStatusProvider };
