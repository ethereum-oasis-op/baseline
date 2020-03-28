const axios = require('axios');
const logger = require('winston');
require('../logger');
const Identity = require('../db/models/Identity');
const Message = require('../db/models/Message');
const { receiveMessageQueue } = require('../queues/receiveMessage/');

const {
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
} = require('../clients/whisper/whisperUtils.js');

const radishApiUrl = process.env.RADISH_API_URL ? `${process.env.RADISH_API_URL}/api/v1` : 'http://localhost:8101/api/v1';

/**
 * Function that checks whether given object has a JSON structure?
 * @param {Object} str 
 */
function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    const isJSON = type === '[object Object]' || type === '[object Array]';
    return [isJSON, result];
  } catch (err) {
    return [false, {}];
  }
}

// ***** Usage *****
// const [err, result] = safeJsonParse('[Invalid JSON}');
// if (err) console.log('Failed to parse JSON: ' + err.message);
// else console.log(result);
function safeJsonParse(str) {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
}

// Fetch all of the Whisper Identities stored in database
async function getIdentities() {
  const identities = await Identity.find(
    {},
    '-_id publicKey createdDate',
  ).lean();
  return identities;
}

// Function to check whether an identity `myId` exists in the database
async function findIdentity(myId) {
  return Identity.exists({ _id: myId });
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
  return Message.findOneAndUpdate(
    { _id: hash },
    {
      _id: hash,
      messageType: 'individual',
      recipientId: recipientPublicKey,
      senderId: sig,
      ttl,
      topic,
      payload: content,
      pow,
      sentDate: timestamp,
    },
    { upsert: true, new: true },
  );
}

/**
 * Function that forwards the message
 * @param {Object} messageObj 
 */
async function forwardMessage(messageObj) {
  logger.info(`Forwarding message to api service: POST ${radishApiUrl}/documents`);
  try {
    const response = await axios.post(`${radishApiUrl}/documents`, messageObj);
    logger.info(`SUCCESS: POST ${radishApiUrl}/documents`);
    logger.info(`${response.status} -`, response.data);
  } catch (error) {
    logger.error(`ERROR: POST ${radishApiUrl}/documents`);
    if (error.response) {
      logger.error(`${error.response.status} -`, error.response.data);
    }
  }
}

module.exports = {
  hasJsonStructure,
  safeJsonParse,
  getIdentities,
  findIdentity,
  getMessages,
  getSingleMessage,
  storeNewMessage,
  forwardMessage,
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
};
