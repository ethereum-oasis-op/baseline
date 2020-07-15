import { pubsub } from '../graphql/subscriptions';
import db from '../db';

export const getServerState = async () => {
  const serverState = await db.collection('serverstate').findOne({});
  return serverState ? serverState.state : 'error';
};

export const saveServerState = async state => {
  const document = { $set: { state } };
  const options = { upsert: true };
  const serverState = await db.collection('serverstate').findOneAndUpdate({}, document, options);
  return serverState.value ? serverState.value.state : state;
};

export const setServerState = async state => {
  await saveServerState(state);
  await pubsub.publish('SERVER_STATE_UPDATE', { serverStateUpdate: { state } });
};

export default {
  setServerState,
};
