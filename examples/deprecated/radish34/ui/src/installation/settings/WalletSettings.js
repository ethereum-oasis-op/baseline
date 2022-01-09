import React, { useContext }  from 'react';
import { ServerSettingsContext } from '../../contexts/server-settings-context';
import Balance from '../../components/Balance';

const WalletSettings = () => {
  const { settings } = useContext(ServerSettingsContext);
  if (!settings) {return <div>No settings from wallet settings</div>}

  return (
    <div>
      <div>Your Corporate Wallet: {settings.organizationAddress}</div>
      <div>Your Wallet Balance: <Balance /></div>
    </div>
  );
};

export default WalletSettings;
