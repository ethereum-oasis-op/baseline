const Identity = require('./models/Identity');
const Message = require('./models/Message');
const utils = require('./generalUtils');
const whisperUtils = require('./whisperUtils');
const web3utils = require('./web3Utils.js');
const axios = require('axios');
const radishApiUrl = process.env.RADISH_API_URL || 'http://localhost:8101/api/v1';

// Useful constants
const {
  DEFAULT_TOPIC,
  POW_TARGET,
} = utils;

class WhisperWrapper {
  constructor() {
    this.isConnected = whisperUtils.isConnected;
    this.sendPrivateMessage = whisperUtils.sendPrivateMessage;
    this.getIdentities = utils.getIdentities;
    this.findIdentity = utils.findIdentity;
    this.getMessages = utils.getMessages;
    this.getSingleMessage = utils.getSingleMessage;
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
          {
            keyId,
          },
          { new: true },
        );
        await this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
      } catch (err) {
        console.error(
          `Error adding public key ${id.publicKey} to Whisper node: ${err}`,
        );
      }
    });
  }

  async checkMessageContent(data) {
    const web3 = await web3utils.getWeb3();
    const content = await web3.utils.toAscii(data.payload);
    // Check if this is a JSON structured message
    const [isJSON, messageObj] = await utils.hasJsonStructure(content);
    let doc;
    if (isJSON && messageObj.type === 'delivery_receipt') {
      // Check if receipt came from original recipient
      const originalMessage = await Message.findOne({
        _id: messageObj.messageId,
      });
      if (!originalMessage) {
        throw new Error(
          `Original message id (${messageObj.messageId}) not found. Cannot add delivery receipt.`,
        );
      } else if (originalMessage.recipientId === data.sig) {
        doc = await Message.findOneAndUpdate(
          { _id: messageObj.messageId },
          { deliveredDate: messageObj.deliveredDate },
          { upsert: false, new: true },
        );
      }
    } else {
      // Always store raw messages
      doc = await Message.findOneAndUpdate(
        { _id: data.hash },
        {
          _id: data.hash,
          messageType: 'individual',
          recipientId: data.recipientPublicKey,
          senderId: data.sig,
          ttl: data.ttl,
          topic: data.topic,
          payload: content,
          pow: data.pow,
          sentDate: data.timestamp,
        },
        { upsert: true, new: true },
      );

      // Send non 'delivery_receipt' JSON objects to radish-api service to store/update 
      if (isJSON) {
        console.log(`Forwarding doc to radish-api: POST ${radishApiUrl}/documents`);
        try {
          let response = await axios.post(`${radishApiUrl}/documents`, messageObj);
          console.log(`SUCCESS: POST ${radishApiUrl}/documents`);
          console.log(`${response.status} -`, response.data);
        } catch (error) {
          console.error(`ERROR: POST ${radishApiUrl}/documents`);
          console.log(`${error.response.status} -`, error.response.data);
        };
      }

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
    return doc;
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
        await this.checkMessageContent(data);
      })
      .on('error', (err) => {
        console.log(err);
      });
  }
}

module.exports = WhisperWrapper;
