import db from '../db';
import { pubsub } from '../graphql/subscriptions';
import { logger } from 'radish34-logger';

export const getNoticeById = async id => {
  const notice = await db.collection('notices').findOne({ _id: id });
  return notice;
};

export const getAllNotices = async () => {
  const notices = await db
    .collection('notices')
    .find({})
    .toArray();

  return notices;
};

export const getNoticesByCategory = async category => {
  const notices = await db
    .collection('notices')
    .find({ category })
    .toArray();

  return notices;
};

export const getInbox = async () => {
  const notices = await db
    .collection('notices')
    .find({ status: 'incoming' })
    .toArray();
  return notices;
};

export const getOutbox = async () => {
  const notices = await db
    .collection('notices')
    .find({ status: 'outgoing' })
    .toArray();
  return notices;
};

export const saveNotice = async input => {
  logger.info('Savin the notices.', { service: 'API' });
  const count = await db.collection('notices').estimatedDocumentCount();
  const doc = Object.assign(input, { _id: count + 1 });
  const notice = await db.collection('notices').insertOne(doc);
  pubsub.publish('NEW_NOTICE', { newNotice: notice.ops[0] });
  return notice;
};
