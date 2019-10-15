import React from 'react';
import PropTypes from 'prop-types';
import MetaMaskContext from './metamask-context';
import { loadUser, UserProvider } from './user-context';

function AppProviders({ children }) {
  const user = loadUser();
  const immediate = !!user;

  return (
    <MetaMaskContext.Provider immediate={immediate}>
      <UserProvider>{children}</UserProvider>
    </MetaMaskContext.Provider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
