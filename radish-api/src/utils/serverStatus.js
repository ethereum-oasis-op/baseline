import config from 'config';
import { merge } from 'lodash';
import { pubsub } from '../subscriptions';
import db from '../db';
import { getBalance } from './wallet';

export const getServerStatus = async () => {
  const balance = await getBalance();
  return { balance };
};

export default {
  getServerStatus,
};
