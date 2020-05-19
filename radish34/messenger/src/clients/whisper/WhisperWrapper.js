const Identity = require('../../db/models/Identity');
const Message = require('../../db/models/Message');
const generalUtils = require('../../utils/generalUtils');
const whisperUtils = require('./whisperUtils');
const web3utils = require('./web3Utils.js');
const { logger } = require('radish34-logger');

// Useful constants
const {
  DEFAULT_TOPIC,
  POW_TARGET,
} = generalUtils;

class WhisperWrapper {
  constructor() {
    this.isConnected = whisperUtils.isConnected;
    this.sendPrivateMessage = whisperUtils.sendPrivateMessage;
    this.getIdentities = generalUtils.getIdentities;
    this.findIdentity = generalUtils.findIdentity;
    this.getMessages = generalUtils.getMessages;
    this.forwardMessage = generalUtils.forwardMessage;
    this.getSingleMessage = generalUtils.getSingleMessage;
  }

  // If the Identities collection is empty, create a new Identity
  async createFirstIdentity() {
    const identities = await Identity.find({});
    if (identities.length === 0) {
      await this.createIdentity();
    }
  }

  async createIdentity() {
    // Create new public/private key pair
    const web3 = await web3utils.getWeb3();
    const keyId = await web3.shh.newKeyPair();
    const pubKey = await web3.shh.getPublicKey(keyId);
    const privKey = await web3.shh.getPrivateKey(keyId);

    // Store key's details in database
    const time = await Math.floor(Date.now() / 1000);
    const result = await Identity.findOneAndUpdate(
      { _id: pubKey },
      {
        _id: pubKey,
        publicKey: pubKey,
        privateKey: privKey,
        keyId,
        createdDate: time,
      },
      { upsert: true, new: true },
    );

    this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
    return { publicKey: result.publicKey, createdDate: result.createdDate };
  }

  // Load previously created Whisper IDs from database into Whisper node
  async loadIdentities() {
    const identities = await Identity.find({});
    identities.forEach(async (id) => {
      try {
        const web3 = await web3utils.getWeb3();
        const keyId = await web3.shh.addPrivateKey(id.privateKey);
        const pubKey = await web3.shh.getPublicKey(keyId);
        // keyId will change so need to update that in Mongo
        await Identity.findOneAndUpdate(
          { _id: pubKey },
          { keyId },
          { new: true },
        );
        await this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
      } catch (err) {
        logger.error(
          `Error adding public key ${id.publicKey} to Whisper node.\n%o`, err, { service: 'MESSENGER' }
        );
      }
    });
  }

  async checkMessageContent(data) {
    const web3 = await web3utils.getWeb3();
    const content = await web3.utils.toAscii(data.payload);
    // Check if this is a JSON structured message
    const [isJSON, messageObj] = await generalUtils.hasJsonStructure(content);
    // Store raw message
    let doc = await generalUtils.storeNewMessage(data, content);
    if (isJSON) {
      if (messageObj.type === 'delivery_receipt') {
        // Check if receipt came from original recipient
        const originalMessage = await Message.findOne({
          _id: messageObj.messageId,
        });
        if (!originalMessage) {
          logger.error(`Original message id ${messageObj.messageId} not found. Cannot add delivery receipt.`, { service: 'MESSENGER' });
          throw new Error(`Original message id ${messageObj.messageId} not found. Cannot add delivery receipt.`);
        } else if (originalMessage.recipientId === data.sig) {
          // Update original message to indicate successful delivery
          doc = await Message.findOneAndUpdate(
            { _id: messageObj.messageId },
            { deliveredDate: messageObj.deliveredDate },
            { upsert: false, new: true },
          );
        }
      } else {
        this.sendDeliveryReceipt(data);
      }
      // Append source message ID to the object for tracking inbound
      // messages from partners via the messenger API
      messageObj.messageId = data.hash;
      // Adding sender Id to message to know who sent the message
      messageObj.senderId = data.sig;
      // Send all JSON messages to processing service
      this.forwardMessage(messageObj);
    } else { // Text message
      await this.sendDeliveryReceipt(data);
    }
    return doc;
  }

  async sendDeliveryReceipt(data) {
    // Send delivery receipt back to sender
    const time = await Math.floor(Date.now() / 1000);
    const receiptObject = {
      type: 'delivery_receipt',
      deliveredDate: time,
      messageId: data.hash,
    };
    const receiptString = JSON.stringify(receiptObject);
    await this.sendPrivateMessage(
      data.recipientPublicKey,
      data.sig,
      undefined,
      receiptString,
    );
  }

  async subscribeToPrivateMessages(userId, topic = DEFAULT_TOPIC) {
    // Find this identity in Mongo so we can get the associated keyId
    const whisperId = await Identity.findOne({ _id: userId });
    // Subscribe to private messages
    const web3 = await web3utils.getWeb3();
    web3.shh
      .subscribe('messages', {
        minPow: POW_TARGET,
        privateKeyID: whisperId.keyId,
        topics: [topic],
      })
      .on('data', async (data) => {
        // TODO check if sender is in my contacts before processing
        try {
          await this.checkMessageContent(data);
        } catch (error) {
          logger.error('\n%o', err, { service: 'MESSENGER' });
        }
      })
      .on('error', (err) => {
        logger.error('\n%o', err, { service: 'MESSENGER' });
      });
  }
}

module.exports = WhisperWrapper;
