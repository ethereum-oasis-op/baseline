const logger = require('winston');
const Identity = require('../../db/models/Identity.js');
const Message = require('../../db/models/Message.js');
const web3utils = require('./web3Utils.js');

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;
// Call this function before sending Whisper commands
async function isConnected() {
  return web3utils.isConnected();
}

// Send private message
async function sendPrivateMessage(
  senderId,
  recipientId,
  topic = DEFAULT_TOPIC,
  messageContent,
) {
  let messageString = messageContent;
  if (typeof messageContent === 'object') {
    messageString = JSON.stringify(messageContent);
  }
  const web3 = await web3utils.getWeb3();
  const content = await web3.utils.fromAscii(messageString);
  let whisperId;
  console.log('TESTING THIS OUT', senderId,
    recipientId,
    DEFAULT_TOPIC,
    messageContent);

  console.log('-----------------');
  const t = await Identity.findOne({});
  console.log('SENDER ID?', senderId);
  console.log('ALL IDENTITIES', t);
  try {
    whisperId = await Identity.findOne({ _id: senderId });
    console.log('WHISPER ID?', senderId, whisperId);
  } catch (error) {
    console.log('error retreiving id:', error);
  }
  let hash;
  console.log('WHISPER ID?', whisperId);
  try {
    hash = await web3.shh.post({
      pubKey: recipientId,
      sig: whisperId.keyId,
      ttl: TTL,
      topic,
      payload: content,
      powTime: POW_TIME,
      powTarget: POW_TARGET,
    });
  } catch (err) {
    logger.error('Whisper error:', err);
    return undefined;
  }

  // Store message in database
  const time = await Math.floor(Date.now() / 1000);
  let doc;
  try {
    doc = await Message.findOneAndUpdate(
      { _id: hash },
      {
        _id: hash,
        messageType: 'individual',
        recipientId,
        senderId,
        ttl: TTL,
        topic,
        payload: messageString,
        pow: POW_TARGET,
        sentDate: time,
      },
      { upsert: true, new: true },
    );
  } catch (err) {
    logger.error('Mongoose error:', err);
    return undefined;
  }
  return doc;
}

module.exports = {
  isConnected,
  sendPrivateMessage,
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
};
