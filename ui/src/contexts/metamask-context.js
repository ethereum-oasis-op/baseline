import React from 'react';
import { createMetaMaskContext } from '@daisypayments/react-metamask';

const MetaMaskContext = createMetaMaskContext();

export const useMetaMask = () => {
  const context = React.useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
};

export default MetaMaskContext;
