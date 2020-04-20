import config from 'config';
import { pubsub } from '../subscriptions';
import db from '../db';

export const loadServerSettingsFromFile = async () => {
  console.log('Loading config file ...');
  const storedSettings = await db.collection('serversettings').findOne({});
  // Overwrite current settings stored in db with what is in config file
  const settings = {
    ...JSON.parse(JSON.stringify(storedSettings)),
    ...JSON.parse(JSON.stringify(config))
  }
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

export const setContractAddress = async (contractName, contractAddress) => {
  const doc = {};
  doc.addresses[contractName] = contractAddress;
  await db.collection('serversettings').findOneAndUpdate({}, { $set: doc }, { upsert: true });
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export const setOrganizationWalletAddress = async organizationAddress => {
  // assign organization.address:
  await db
    .collection('serversettings')
    .findOneAndUpdate(
      {},
      { $set: { 'organization.address': organizationAddress } },
      { upsert: true },
    );
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export default {
  loadServerSettingsFromFile,
  getServerSettings,
  setRPCProvider,
  setOrganizationWalletAddress,
  setContractAddress,
};
