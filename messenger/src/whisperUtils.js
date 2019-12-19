const Identity = require('./models/Identity.js');
const Message = require('./models/Message.js');
const utils = require('./generalUtils.js');
const web3utils = require('./web3Utils.js');

// Useful constants
const {
  DEFAULT_TOPIC,
  POW_TIME,
  TTL,
  POW_TARGET,
} = utils;

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
  const whisperId = await Identity.findOne({ _id: senderId });
  let hash;
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
    console.error('Whisper error:', err);
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
        messageType: 'private',
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
    console.error('Mongoose error:', err);
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
