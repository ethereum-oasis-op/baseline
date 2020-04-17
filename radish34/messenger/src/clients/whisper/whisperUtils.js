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
  const content = web3.utils.fromAscii(messageString);
  const whisperId = await Identity.findOne({ _id: senderId });
  const { keyId } = whisperId;
  let hash;
  try {
    const payload = {
      pubKey: recipientId,
      sig: keyId,
      ttl: TTL,
      topic,
      payload: content,
      powTime: POW_TIME,
      powTarget: POW_TARGET,
    };
    hash = await web3.shh.post(payload);
  } catch (err) {
    logger.error('Whisper error:', err);
    return undefined;
  }

  // Store message in database
  const time = Math.floor(Date.now() / 1000);
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
