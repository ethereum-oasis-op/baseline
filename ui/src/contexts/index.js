import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import MetaMaskContext from './metamask-context';
import { loadUser, UserProvider } from './user-context';

// TODO: Replace with config
const client = new ApolloClient({
  uri: 'http://radish-api.docker/',
 });

function AppProviders({ children }) {
  const user = loadUser();
  const immediate = !!user;

  return (
    <ApolloProvider client={client}>
      <MetaMaskContext.Provider immediate={immediate}>
        <UserProvider>{children}</UserProvider>
      </MetaMaskContext.Provider>
    </ApolloProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
