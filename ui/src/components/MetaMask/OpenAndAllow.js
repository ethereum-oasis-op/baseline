import React, { useContext } from 'react';
import MetaMaskContext from '../../contexts/metamask-context';

const OpenAndAllow = () => {
  const { openMetaMask } = useContext(MetaMaskContext);

  return (
    <div>
      Please Open and Allow Metamask
      <button type="button" onClick={openMetaMask}>
        Open
      </button>
    </div>
  );
};

export default OpenAndAllow;
