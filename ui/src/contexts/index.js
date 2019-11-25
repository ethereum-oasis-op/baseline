import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import MetaMaskContext from './metamask-context';
import { loadUser, UserProvider } from './user-context';
import { ServerStatusProvider } from './server-status-context';
import { ServerSettingsProvider } from './server-settings-context';
import { PartnerProvider } from './partner-context';

const uri = window.localStorage.getItem('api') || 'radish-api-buyer.docker/graphql';

const httpLink = new HttpLink({
  uri: `http://${uri}`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${uri}`,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const link = ApolloLink.from([terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

function AppProviders({ children }) {
  const user = loadUser();
  const immediate = !!user;

  return (
    <ApolloProvider client={client}>
      <MetaMaskContext.Provider immediate={immediate}>
        <ServerSettingsProvider>
          <ServerStatusProvider>
            <PartnerProvider>
              <UserProvider>{children}</UserProvider>
            </PartnerProvider>
          </ServerStatusProvider>
        </ServerSettingsProvider>
      </MetaMaskContext.Provider>
    </ApolloProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
