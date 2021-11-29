import React, { useContext }  from 'react';
import { ServerSettingsContext } from '../../contexts/server-settings-context';

const RegisterSettings = () => {
  const { settings } = useContext(ServerSettingsContext);
  console.log('Register SETTINGS', settings);

  return <div>RegisterSettings</div>;
};

export default RegisterSettings;
