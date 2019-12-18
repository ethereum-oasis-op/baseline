import config from 'config';
import { merge } from 'lodash';
import { pubsub } from '../subscriptions';
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

export const setRPCProvider = async rpcProvider => {
  const doc = { rpcProvider };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return { serverSettingsUpdate: settings };
};

export const setOrganizationWalletAddress = async organizationAddress => {
  const doc = { organizationAddress };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export const setERC1820RegistryAddress = async erc1820RegistryAddress => {
  const doc = { erc1820RegistryAddress };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export const setRegistrarAddress = async registrarAddress => {
  const doc = { registrarAddress };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export const setOrganizationRegistryAddress = async organizationRegistryAddress => {
  const doc = { organizationRegistryAddress };
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export default {
  loadServerSettingsFromFile,
  getServerSettings,
  setRPCProvider,
  setOrganizationWalletAddress,
  setERC1820RegistryAddress,
  setRegistrarAddress,
  setOrganizationRegistryAddress,
};
