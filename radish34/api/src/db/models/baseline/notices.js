import mongoose from 'mongoose';
import { getPartnerByMessengerKey } from '../../../services/partner';
import { logger } from 'radish34-logger';
// import { pubsub } from '../subscriptions';

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
    required: false,
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
  logger.info('Saving the notice.', { service: 'API' });
  const count = await Notice.estimatedDocumentCount();
  const doc = Object.assign(input, { _id: count + 1 });
  const notice = await Notice.insertOne(doc);
  return notice;
};

/**
 * Creates a new incoming notice for a partner based on data sent from a different partner
 * @param {String} category - the category this notice should fall under (RFP/MSA/Proposal...)
 * @param {Object} payload - the payload/object sent through whisper that was stored in partner db
 */
export const createNotice = async (category, payload, categoryId = null) => {
  try {
    const sender = await getPartnerByMessengerKey(payload.sender);
    const newNotice = {
      resolved: false,
      categoryId: categoryId || payload._id,
      category,
      subject: `New ${category}: ${payload._id}`,
      from: sender.name,
      statusText: 'Awaiting Response',
      lastModified: Math.floor(Date.now() / 1000),
      status: 'incoming',
    };
    const notice = await Notice.create([newNotice], { upsert: true, new: true });
    // pubsub.publish('NEW_NOTICE', { newNotice: notice[0] });
    return notice;
  } catch (err) {
    logger.error('Error creating notice.\n%o', err, { service: 'API' });
  }
};

export default {
  getNoticeById,
  getAllNotices,
  getNoticesByCategory,
  getInbox,
  saveNotice,
  createNotice,
};
