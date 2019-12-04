import config from 'config';
import { merge } from 'lodash';
import db from '../db';

export const loadServerSettingsFromFile = async () => {
  console.log('Loading config file ...');
  const storedSettings = await db.collection('serversettings').findOne({});
  const settings = merge(config, storedSettings);
  delete settings._id;
  delete settings.util;
  await db.collection('serversettings').findOneAndUpdate({}, { $set: settings }, { upsert: true });
};

export const getServerSettings = async () => {
  const serverSettings = await db.collection('serversettings').findOne({});
  delete serverSettings._id;
  delete serverSettings.util;
  return serverSettings;
};

export const setNetworkId = async networkId => {
  const doc = { networkId };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  return settings;
};

export const setOrganizationRegistryAddress = async organizationRegistryAddress => {
  const doc = { organizationRegistryAddress };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  return settings;
};

export default {
  loadServerSettingsFromFile,
  getServerSettings,
  setNetworkId,
  setOrganizationRegistryAddress,
};
