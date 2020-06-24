const Identity = require('./models/Identity');
const Message = require('./models/Message');
const { DEFAULT_TOPIC } = require('../utils/generalUtils');

// Fetch all of the Whisper Identities stored in database
async function getIdentities() {
  const identities = await Identity.find({});
  return identities;
}

// Function to check whether an identity `myId` exists in the database
async function findIdentity(myId) {
  return Identity.findOne({ _id: myId });
}

async function addIdentity(newIdentity) {
  const dbUpdate = { _id: newIdentity.publicKey, ...newIdentity };
  const identity = await Identity.findOneAndUpdate(
    { _id: newIdentity.publicKey },
    dbUpdate,
    { upsert: true, new: true },
  );
  return identity;
}

// Fetch messages for a given conversation
// Private conversation = all messages with same topic and same two Whisper Ids
async function getMessages(myId, topic = DEFAULT_TOPIC, partnerId, since) {
  const currentTime = Math.floor(Date.now() / 1000);
  let timeThreshold = parseInt(since, 10);
  // Default to showing last 24 hours of messages
  if (!since) {
    timeThreshold = currentTime - 86400; // 86400 seconds in a day
  }
  // If no partnerId provided, get messages from all conversations
  if (!partnerId) {
    const messages = await Message.aggregate([
      {
        $match: {
          topic,
          sentDate: { $gte: timeThreshold },
          $or: [{ recipientId: myId }, { senderId: myId }],
        },
      },
    ]);
    return messages;
  }
  // If partnerId provided, only get messages involving that whisperId
  return Message.aggregate([
    {
      $match: {
        topic,
        sentDate: { $gte: timeThreshold },
        $or: [
          { topic, recipientId: myId, senderId: partnerId },
          { topic, recipientId: partnerId, senderId: myId },
        ],
      },
    },
  ]);
}

// Function that fetch a single message from DB as per the messageId
async function getSingleMessage(messageId) {
  return Message.findOne({ _id: messageId });
}

/**
 * Function to store new message in the database
 * @param {Object} messageData 
 * @param {String} content 
 */
async function storeNewMessage(messageData, content) {
  const { hash, recipientPublicKey, sig, ttl, topic, pow, timestamp } = messageData;
  let payload = content;
  if (typeof content === 'object') {
    payload = JSON.stringify(content);
  }
  console.log('storing new message')
  return Message.findOneAndUpdate(
    { _id: hash },
    {
      _id: hash,
      messageType: 'individual',
      recipientId: recipientPublicKey,
      senderId: sig,
      ttl,
      topic,
      payload,
      pow,
      sentDate: timestamp,
    },
    { upsert: true, new: true },
  );
}

module.exports = {
  getIdentities,
  findIdentity,
  addIdentity,
  getMessages,
  getSingleMessage,
  storeNewMessage
}
