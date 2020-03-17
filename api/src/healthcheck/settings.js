import config from 'config';
import { merge } from 'lodash';
import { getServerSettings, setServerSettings } from '../db/models/baseline/server/settings';

export const loadSettings = async () => {
  console.log('Loading settings ...');
  const storedServerSettings = await getServerSettings();
  // const configFromFile = config.util.toObject();

  // TODO: Fix the merge of the config file and the current stored values
  // This is a temp fix to be able to carry on with the refactor
  const { rpcProvider, organization, addresses } = config;

  const storedSettings = {
    rpcProvider,
    organization,
    addresses,
  };

  const settings = merge(storedSettings, {});
  await setServerSettings(settings);
  const loadedSettings = await getServerSettings();
  console.log('Settings:', loadedSettings);
};

export default {
  loadSettings,
};
