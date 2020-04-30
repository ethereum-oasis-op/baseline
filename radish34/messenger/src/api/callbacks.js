
const { hasJsonStructure, forwardMessage } = require('../utils/generalUtils');
const { storeNewMessage } = require('../db/interactions');
const Message = require('../db/models/Message');

async function checkMessageContent(data) {
  const web3 = await getWeb3();
  const content = await web3.utils.toAscii(data.payload);
  // Check if this is a JSON structured message
  const [isJSON, messageObj] = await hasJsonStructure(content);
  // Store raw message
  let doc = await storeNewMessage(data, content);
  if (isJSON) {
    if (messageObj.type === 'delivery_receipt') {
      // Check if receipt came from original recipient
      const originalMessage = await Message.findOne({
        _id: messageObj.messageId,
      });
      if (!originalMessage) {
        throw new Error(`Original message id (${messageObj.messageId}) not found. Cannot add delivery receipt.`);
      } else if (originalMessage.recipientId === data.sig) {
        // Update original message to indicate successful delivery
        doc = await Message.findOneAndUpdate(
          { _id: messageObj.messageId },
          { deliveredDate: messageObj.deliveredDate },
          { upsert: false, new: true },
        );
      }
    } else {
      sendDeliveryReceipt(data);
    }
    // Append source message ID to the object for tracking inbound
    // messages from partners via the messenger API
    messageObj.messageId = data.hash;
    // Adding sender Id to message to know who sent the message
    messageObj.senderId = data.sig;
    // Send all JSON messages to processing service
    forwardMessage(messageObj);
  } else { // Text message
    await sendDeliveryReceipt(data);
  }
  return doc;
}

async function sendDeliveryReceipt(data) {
  // Send delivery receipt back to sender
  const time = await Math.floor(Date.now() / 1000);
  const receiptObject = {
    type: 'delivery_receipt',
    deliveredDate: time,
    messageId: data.hash,
  };
  const receiptString = JSON.stringify(receiptObject);
  await this.publish(
    undefined,
    receiptString,
    data.sig,
  );
}

module.exports = {
  checkMessageContent,
}
