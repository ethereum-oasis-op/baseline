import React, { useContext }  from 'react';
import { ServerSettingsContext } from '../../contexts/server-settings-context';

const RegistrySettings = () => {
  const { settings } = useContext(ServerSettingsContext);
  console.log('Registry SETTINGS', settings);

  return <div>RegistrySettings</div>;
};

export default RegistrySettings;
