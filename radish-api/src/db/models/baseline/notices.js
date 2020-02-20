import mongoose from 'mongoose';

/**
 * Notes:
 */

const NoticesSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  statusText: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Notice = mongoose.model('notices', NoticesSchema);

export const getNoticeById = async id => {
  const notice = await Notice.findOne({ _id: id });
  return notice;
};

export const getAllNotices = async () => {
  const notices = await Notice.find({}).toArray();
  return notices;
};

export const getNoticesByCategory = async category => {
  const notices = await Notice.find({ category }).toArray();
  return notices;
};

export const getInbox = async () => {
  const notices = await Notice.find({ status: 'incoming' }).toArray();
  return notices;
};

export const getOutbox = async () => {
  const notices = await Notice.find({ status: 'outgoing' }).toArray();
  return notices;
};

export const saveNotice = async input => {
  console.log('Saving the notice');
  const count = await Notice.estimatedDocumentCount();
  const doc = Object.assign(input, { _id: count + 1 });
  const notice = await Notice.insertOne(doc);
  return notice;
};

export default {
  getNoticeById,
  getAllNotices,
  getNoticesByCategory,
  getInbox,
  saveNotice,
};
