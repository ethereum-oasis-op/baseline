import React, { useContext }  from 'react';
import { ServerSettingsContext } from '../../contexts/server-settings-context';

const NetworkSettings = () => {
  const { settings } = useContext(ServerSettingsContext);
  if (!settings || !settings.rpcProvider) {
    return <div>Error of some kind. plz fix.</div>
  }
  return <div>Connected to the {settings.rpcProvider}</div>;
};

export default NetworkSettings;
