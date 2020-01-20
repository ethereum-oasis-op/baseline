import mongoose from 'mongoose';
import { getPartnerByIdentity } from '../services/partner';

const MessageSchema = new mongoose.Schema({
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
  }
});

const Message = mongoose.model('messages', MessageSchema);

/**
 * Creates a new incoming message for a partner based on data sent from a different partner
 * @param {String} category - the category this message should fall under (RFP/MSA/Proposal...)
 * @param {Object} payload - the payload/object sent through whisper that was stored in partner db
 */
export const createMessage = async (category, payload) => {
  try {
    const sender = await getPartnerByIdentity(payload.sender);
    const newMessage = {
      categoryId: payload._id,
      category,
      subject: `New ${category}: ${payload._id}`,
      from: sender.name,
      statusText: 'Awaiting Response',
      lastModified: Math.floor(Date.now() / 1000),
      status: 'incoming',
    };
    const message = await Message.create([newMessage], { upsert: true, new: true });
    return message;
  } catch (e) {
    console.log('Error creating message: ', e);
  }
}
