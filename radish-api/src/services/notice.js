import db from '../db';

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
  console.log('Saving the notices');
  const count = await db.collection('notices').estimatedDocumentCount();
  const doc = Object.assign(input, { _id: count + 1 });
  const notice = await db.collection('notices').insertOne(doc);
  return notice;
};
