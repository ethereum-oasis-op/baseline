const { hasJsonStructure } = require('../utils/generalUtils');
const { storeNewMessage } = require('../db/interactions');
const logger = require('winston');
const Web3 = require('web3');
const axios = require('axios');
const { DEFAULT_TOPIC } = require('../utils/generalUtils');
const Message = require('../db/models/Message');

const radishApiUrl = process.env.RADISH_API_URL ? `${process.env.RADISH_API_URL}/api/v1` : 'http://localhost:8101/api/v1';

//const processWhisperMessage = async (metadata) => {
async function processWhisperMessage(metadata) {
  const web3 = await new Web3();
  const payloadAscii = await web3.utils.toAscii(metadata.payload);
  // Check if this is a JSON structured message
  const [isJSON, messageObj] = await hasJsonStructure(payloadAscii);
  // Store raw message
  let doc = await storeNewMessage(metadata, payloadAscii);
  if (isJSON) {
    if (messageObj.type === 'delivery_receipt') {
      // Check if receipt came from original recipient
      const originalMessage = await Message.findOne({
        _id: messageObj.messageId,
      });
      if (!originalMessage) {
        throw new Error(`Original message id (${messageObj.messageId}) not found. Cannot add delivery receipt.`);
      } else if (originalMessage.recipientId === metadata.sig) {
        // Update original message to indicate successful delivery
        doc = await Message.findOneAndUpdate(
          { _id: messageObj.messageId },
          { deliveredDate: messageObj.deliveredDate },
          { upsert: false, new: true },
        );
      }
    } else {
      // Use .call() so that we can pass the Whisper class instance as "this",
      // therefore we can call Whisper class methods. Otherwise "this" is 
      // scoped by callback function.
      await sendDeliveryReceipt.call(this, metadata);
    }
    // Append source message ID to the object for tracking inbound
    // messages from partners via the messenger API
    messageObj.messageId = metadata.hash;
    // Adding sender Id to message to know who sent the message
    messageObj.senderId = metadata.sig;
    // Send all JSON messages to processing service
    forwardMessage(messageObj);
  } else { // Text message
    await sendDeliveryReceipt.call(this, metadata);
  }
  return doc;
}

async function sendDeliveryReceipt(metadata) {
  // Send delivery receipt back to sender
  const time = await Math.floor(Date.now() / 1000);
  const receiptObject = {
    type: 'delivery_receipt',
    deliveredDate: time,
    messageId: metadata.hash,
  };
  const receiptString = JSON.stringify(receiptObject);
  this.publish(DEFAULT_TOPIC, receiptString, undefined, metadata.sig);
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
  processWhisperMessage,
}
