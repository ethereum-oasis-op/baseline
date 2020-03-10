const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['individual', 'group'],
      required: true,
    },
    recipientId: String,
    senderId: String,
    ttl: Number,
    topic: String,
    payload: String,
    pow: Number,
    sentDate: Number,
    deliveredDate: Number,
  },
  {
    collection: 'Messages',
    versionKey: false,
  }
);

const Messages = mongoose.model('Messages', MessageSchema);

module.exports = Messages;
