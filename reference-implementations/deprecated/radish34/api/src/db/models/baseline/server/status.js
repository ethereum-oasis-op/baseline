import mongoose from 'mongoose';
import { pubsub } from '../../../../graphql/subscriptions';

const ServerStatusSchema = new mongoose.Schema(
  {
    balance: {
      type: String,
    },
    warnings: {
      lowbalance: Boolean,
    },
  },
  {
    versionKey: false,
  },
);

const ServerStatusModel = mongoose.model('serverstatus', ServerStatusSchema);

export const getServerStatus = async () => {
  const serverStatus = await ServerStatusModel.findOne({});
  delete serverStatus._id;
  delete serverStatus.util;
  return serverStatus;
};

export const publishStatus = async () => {
  const status = await getServerStatus();
  await pubsub.publish('SERVER_STATUS_UPDATE', { serverStatusUpdate: status });
  return status;
};

export const setServerStatus = async settings => {
  await ServerStatusModel.findOneAndUpdate({}, { $set: settings }, { upsert: true });
  return publishStatus();
};

export default {
  getServerStatus,
  publishStatus,
  setServerStatus,
};
