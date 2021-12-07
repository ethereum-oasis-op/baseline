import mongoose from 'mongoose';
import { pubsub } from '../../../../graphql/subscriptions';

const ServerStateSchema = new mongoose.Schema(
  {
    state: String,
    onboarded: String,
  },
  {
    versionKey: false,
  },
);

const ServerStateModel = mongoose.model('serverstate', ServerStateSchema);

export const getServerState = async () => {
  const serverState = await ServerStateModel.findOne({});
  if (serverState) {
    delete serverState._id;
    delete serverState.util;
  }
  return serverState || { state: 'firstboot' };
};

export const publishState = async () => {
  const state = await getServerState();
  await pubsub.publish('SERVER_STATE_UPDATE', { serverStateUpdate: state });
  return state;
};

export const setServerState = async state => {
  await ServerStateModel.findOneAndUpdate({}, { $set: { state } }, { upsert: true });
  return publishState();
};

export default {
  getServerState,
  publishState,
  setServerState,
};
