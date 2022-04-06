import mongoose from 'mongoose';
import { pubsub } from '../../../../graphql/subscriptions';

const ServerSettingsSchema = new mongoose.Schema(
  {
    rpcProvider: {
      type: String,
    },
    organizationName: {
      type: String,
    },
    organizationRole: {
      type: Number,
    },
    organizationAddress: {
      type: String,
    },
    organizationRegistryAddress: {
      type: String,
    },
    globalRegistryAddress: {
      type: String,
    },
    organizationWhisperKey: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

const ServerSettingsModel = mongoose.model('serversettings', ServerSettingsSchema);

export const getServerSettings = async () => {
  const serverSettings = (await ServerSettingsModel.findOne({})) || {};
  if (serverSettings) {
    delete serverSettings._id;
    delete serverSettings.util;
  }
  return serverSettings || {};
};

export const publishSettings = async () => {
  const settings = await getServerSettings();
  await pubsub.publish('SERVER_SETTINGS_UPDATE', { serverSettingsUpdate: settings });
  return settings;
};

export const setServerSettings = async settings => {
  await ServerSettingsModel.findOneAndUpdate({}, { $set: {  ...settings  } }, { upsert: true });
  return publishSettings();
};

export const setServerSetting = async (key, value) => {
  await ServerSettingsModel.findOneAndUpdate({}, { $set: { [`${key}`]: value } }, { upsert: true });
  return publishSettings();
};;

export default {
  getServerSettings,
  publishSettings,
  setServerSettings,
};
