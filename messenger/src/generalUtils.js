const Identity = require('./models/Identity');
const Message = require('./models/Message');
const axios = require('axios');

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;
const radishApiUrl = process.env.RADISH_API_URL || 'http://localhost:8101/api/v1';

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

// Find single identity in database
async function findIdentity(myId) {
  return Identity.exists({ _id: myId });
}

// Fetch messages for a given conversation
// Private conversation = all messages with same topic and same two Whisper Ids
async function getMessages(myId, topic = DEFAULT_TOPIC, partnerId, since) {
  const currentTime = await Math.floor(Date.now() / 1000);
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

async function getSingleMessage(messageId) {
  return Message.findOne({ _id: messageId });
}

async function forwardMessage(messageObj) {
  console.log(`Forwarding message to radish-api: POST ${radishApiUrl}/documents`);
  try {
    let response = await axios.post(`${radishApiUrl}/documents`, messageObj);
    console.log(`SUCCESS: POST ${radishApiUrl}/documents`);
    console.log(`${response.status} -`, response.data);
  } catch (error) {
    console.error(`ERROR: POST ${radishApiUrl}/documents`);
    console.log(`${error.response.status} -`, error.response.data);
  };
}

module.exports = {
  hasJsonStructure,
  safeJsonParse,
  getIdentities,
  findIdentity,
  getMessages,
  getSingleMessage,
  forwardMessage,
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
};
