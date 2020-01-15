import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ServerSettingsProvider } from './server-settings-context';
import { PartnerProvider } from './partner-context';
import { MessageProvider } from './message-context';
import { RFPProvider } from './rfp-context';
import { ProposalProvider } from './proposal-context';
import { MSAProvider } from './msa-context';

const uri = window.localStorage.getItem('api');

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
  return (
    <ApolloProvider client={client}>
      <MessageProvider>
        <ServerSettingsProvider>
  
            <PartnerProvider>
              <RFPProvider>
                <ProposalProvider>
                  <MSAProvider>{children}</MSAProvider>
                </ProposalProvider>
              </RFPProvider>
            </PartnerProvider>

        </ServerSettingsProvider>
      </MessageProvider>
    </ApolloProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
