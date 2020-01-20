import db from '../db';

export const getMessageById = async id => {
  const message = await db.collection('messages').findOne({ _id: id });
  return message;
};

export const getAllMessages = async () => {
  const messages = await db
    .collection('messages')
    .find({})
    .toArray();
  return messages;
};

export const getMessagesByCategory = async category => {
  const messages = await db
    .collection('messages')
    .find({ category })
    .toArray();
  return messages;
};

export const getInbox = async () => {
  const messages = await db
    .collection('messages')
    .find({ status: 'incoming' })
    .toArray();
  return messages;
};

export const getOutbox = async () => {
  const messages = await db
    .collection('messages')
    .find({ status: 'outgoing' })
    .toArray();
  return messages;
};

export const saveMessage = async input => {
  console.log('Saving the message');
  const count = await db.collection('messages').estimatedDocumentCount();
  const doc = Object.assign(input, { _id: count + 1 });
  const message = await db.collection('messages').insertOne(doc);
  return message;
};
