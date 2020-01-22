import mongoose from 'mongoose';
import { getPartnerByIdentity } from '../services/partner';
import { pubsub } from '../subscriptions';

const NoticeSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
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

const Notice = mongoose.model('notices', NoticeSchema);

/**
 * Creates a new incoming notice for a partner based on data sent from a different partner
 * @param {String} category - the category this notice should fall under (RFP/MSA/Proposal...)
 * @param {Object} payload - the payload/object sent through whisper that was stored in partner db
 */
export const createNotice = async (category, payload, categoryId = null) => {
  try {
    const sender = await getPartnerByIdentity(payload.sender);
    const newNotice = {
      categoryId: categoryId || payload._id,
      category,
      subject: `New ${category}: ${payload._id}`,
      from: sender.name,
      statusText: 'Awaiting Response',
      lastModified: Math.floor(Date.now() / 1000),
      status: 'incoming',
    };
    const notice = await Notice.create([newNotice], { upsert: true, new: true });
    pubsub.publish('NEW_NOTICE', { newNotice: notice[0] });
    return notice;
  } catch (e) {
    console.log('Error creating notice: ', e);
  }
};

export default {
  createNotice,
};
