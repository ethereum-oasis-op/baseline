import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GET_SERVER_STATE,
  GET_SERVER_STATE_UPDATE,
  GET_SERVER_SETTINGS,
  GET_SERVER_SETTINGS_UPDATE,
  SET_RPC_PROVIDER,
  SET_WALLET_FROM_MNEMONIC,
  REGISTER_ORGANIZATION
} from '../graphql/server-settings';

const ServerSettingsContext = React.createContext([{}, () => {}]);
let stateListener;
let settingListener;

const stateUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;
  const { serverStateUpdate } = subscriptionData.data;
  return { prev, serverState: serverStateUpdate };
}

const settingsUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;
  const { serverSettingsUpdate } = subscriptionData.data;
  return { prev, getServerSettings: serverSettingsUpdate };
}

const ServerSettingsProvider = ({ children }) => {
  const {
    subscribeToMore: subscribeToStateUpdates,
    data: initState,
    loading,
  } = useQuery(GET_SERVER_STATE);

  const {
    subscribeToMore: subscribeToSettingsUpdates,
    data: initSettings,
    loadingSettings,
  } = useQuery(GET_SERVER_SETTINGS);

  const options = { fetchPolicy: 'no-cache' };

  const [setRPCProvider] = useMutation(SET_RPC_PROVIDER, options);
  const [setWalletFromMnemonic] = useMutation(SET_WALLET_FROM_MNEMONIC, options);
  const [registerOrganizationInfo] = useMutation(REGISTER_ORGANIZATION, options);

  useEffect(() => {
    if (!stateListener) {
      stateListener = subscribeToStateUpdates({
        document: GET_SERVER_STATE_UPDATE,
        updateQuery: stateUpdateQuery,
        fetchPolicy: 'no-cache',
      });
    }
  }, [subscribeToStateUpdates]);

  useEffect(() => {
    if (!settingListener) {
      settingListener = subscribeToSettingsUpdates({
        document: GET_SERVER_SETTINGS_UPDATE,
        updateQuery: settingsUpdateQuery,
      });
    }
  }, [subscribeToSettingsUpdates]);

  const state = initState ? initState.serverState.state : 'nostate';
  const settings = initSettings ? initSettings.getServerSettings : null;

  return (
    <ServerSettingsContext.Provider
      value={{
        state,
        settings,
        loading,
        loadingSettings,
        setRPCProvider,
        registerOrganizationInfo ,
        setWalletFromMnemonic
      }}
    >
      {children}
    </ServerSettingsContext.Provider>
  );
};

ServerSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ServerSettingsContext, ServerSettingsProvider };
