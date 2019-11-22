import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useSubscription, useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';

const ServerSettingsContext = React.createContext([{}, () => {}]);

const GET_SERVER_STATE = gql`
  query GetServerState {
    serverState {
      state
    }
  }
`;

const GET_SERVER_STATE_UPDATE = gql`
  subscription onServerStateUpdate {
    serverStateUpdate {
      state
    }
  }
`;

const GET_SERVER_SETTINGS = gql`
  query GetServerSettings {
    getServerSettings {
      networkId
      organizationRegistryAddress
    }
  }
`;

const SET_NETWORK_ID = gql`
  mutation SetNetworkId($networkId: Int!) {
    setNetworkId(networkId: $networkId) {
      networkId
      organizationRegistryAddress
    }
  }
`;

const SET_ORGANIZATION_REGISTRY_ADDRESSS = gql`
  mutation SetOrganizationRegistryAddress($organizationRegistryAddress: Address!) {
    setOrganizationRegistryAddress(organizationRegistryAddress: $organizationRegistryAddress) {
      networkId
      organizationRegistryAddress
    }
  }
`;

const ServerSettingsProvider = ({ children }) => {
  const { loading, data: initState } = useQuery(GET_SERVER_STATE);
  const { data: updateState } = useSubscription(GET_SERVER_STATE_UPDATE);
  const [getServerState, { data: lazyState }] = useLazyQuery(GET_SERVER_STATE, {
    fetchPolicy: 'no-cache',
  });
  const [getSettings, { data: settings }] = useLazyQuery(GET_SERVER_SETTINGS);
  const [setNetworkId, { data: networkId }] = useMutation(SET_NETWORK_ID);
  const [setOrganizationRegistryAddress, { data: organizationRegistryAddress }] = useMutation(
    SET_ORGANIZATION_REGISTRY_ADDRESSS,
  );
  const state =
    get(updateState, 'serverStateUpdate.state') ||
    get(lazyState, 'serverState.state') ||
    get(initState, 'serverState.state');

  useEffect(() => {
    getServerState();
    getSettings();
  }, [networkId, organizationRegistryAddress, getServerState, getSettings]);

  return (
    <ServerSettingsContext.Provider
      value={{ state, settings, loading, setNetworkId, setOrganizationRegistryAddress }}
    >
      {children}
    </ServerSettingsContext.Provider>
  );
};

ServerSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ServerSettingsContext, ServerSettingsProvider };
