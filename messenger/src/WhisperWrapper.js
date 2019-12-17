const Web3 = require('web3');
const Identity = require('./models/Identity');
const Message = require('./models/Message');
const utils = require("./generalUtils");

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || "0x11223344";
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

class WhisperWrapper {
  constructor() {
    // Singleton pattern: only ever need one instance of this class
    // If one already exists, return it instead of creating a new one
    if (!WhisperWrapper.instance) {
      const web3 = new Web3();
      // Connect to web3 websocket port
      this.web3 = web3;
      WhisperWrapper.instance = this;
    }
    return WhisperWrapper.instance;
  }

  async configureProvider(gethNodeIP, gethNodePort) {
    this.web3.setProvider(new Web3.providers.WebsocketProvider(`ws://${gethNodeIP}:${gethNodePort}`, { headers: { Origin: 'mychat2' } }));
  }

  // Call this function before sending Whisper commands
  async isConnected() {
    let connected = await this.web3.eth.net.isListening();
    this.connected = connected;
    return connected;
  }

  async createIdentity() {
    // Create new public/private key pair
    const keyId = await this.web3.shh.newKeyPair();
    const pubKey = await this.web3.shh.getPublicKey(keyId);
    const privKey = await this.web3.shh.getPrivateKey(keyId);

    // Store key's details in database
    let time = await Math.floor(Date.now() / 1000);
    let result = await Identity.findOneAndUpdate(
      { _id: pubKey },
      {
        _id: pubKey,
        publicKey: pubKey,
        privateKey: privKey,
        keyId: keyId,
        createdDate: time
      },
      { upsert: true, new: true }
    );

    this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
    return { publicKey: result.publicKey, createdDate: result.createdDate };
  }

  // Fetch all of the Whisper Identities stored in database
  async getIdentities() {
    let identities = await Identity.find({}, '-_id publicKey createdDate').lean();
    return identities;
  }

  // Find single identity in database
  async findIdentity(myId) {
    return await Identity.exists({ _id: myId });
  }

  // Load previously created Whisper IDs from database into Whisper node
  async loadIdentities() {
    let identities = await Identity.find({});
    identities.forEach(async (id) => {
      try {
        const keyId = await this.web3.shh.addPrivateKey(id.privateKey);
        const pubKey = await this.web3.shh.getPublicKey(keyId);
        // keyId will change so need to update that in Mongo
        await Identity.findOneAndUpdate(
          { _id: pubKey },
          {
            keyId: keyId
          },
          { new: true }
        );
        await this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
      } catch (err) {
        console.error(`Error adding public key ${id.publicKey} to Whisper node: ${err}`);
      }
    });
  }

  // Fetch messages for a given conversation
  // Private conversation = all messages with same topic and same two Whisper Ids
  async getMessages(myId, topic = DEFAULT_TOPIC, partnerId, since) {
    let currentTime = await Math.floor(Date.now() / 1000);
    let timeThreshold = since;
    // Default to showing last 24 hours of messages
    if (!since) {
      timeThreshold = currentTime - 86400; // 86400 seconds in a day
    }
    // If no partnerId provided, get messages from all conversations
    if (!partnerId) {
      return await Message.aggregate([{
        $match: {
          topic: topic,
          sentDate: { $gte: timeThreshold },
          $or: [
            { recipientId: myId },
            { senderId: myId }
          ]
        },
      }]);
    }
    // If partnerId provided, only get messages involving that whisperId
    return await Message.aggregate([{
      $match: {
        topic: topic,
        sentDate: { $gte: timeThreshold },
        $or: [
          { topic: topic, recipientId: myId, senderId: partnerId },
          { topic: topic, recipientId: partnerId, senderId: myId }
        ]
      }
    }]);
  }

  async getSingleMessage(messageId) {
    return await Message.findOne({ _id: messageId });
  }

  // Send private message
  async sendPrivateMessage(senderId, recipientId, topic = DEFAULT_TOPIC, messageContent) {
    if ((typeof messageContent) === 'object') {
      messageContent = JSON.stringify(messageContent);
    }
    let content = await this.web3.utils.fromAscii(messageContent);
    let whisperId = await Identity.findOne({ _id: senderId });
    let hash;
    try {
      hash = await this.web3.shh.post({
        pubKey: recipientId,
        sig: whisperId.keyId,
        ttl: TTL,
        topic: topic,
        payload: content,
        powTime: POW_TIME,
        powTarget: POW_TARGET
      });
    } catch (err) {
      console.error('Whisper error:', err);
      return;
    }

    // Store message in database
    let time = await Math.floor(Date.now() / 1000);
    let doc;
    try {
      doc = await Message.findOneAndUpdate(
        { _id: hash },
        {
          _id: hash,
          messageType: 'private',
          recipientId: recipientId,
          senderId: senderId,
          ttl: TTL,
          topic: topic,
          payload: messageContent,
          pow: POW_TARGET,
          sentDate: time
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Mongoose error:', err);
      return;
    }
    return doc;
  }

  // Send a public message (group message using symmetric encryption key)
  async sendPublicMessage(senderId, topic = DEFAULT_TOPIC, messageContent) {
    let content = await this.web3.utils.fromAscii(messageContent);
    try {
      this.web3.shh.post({
        symKeyID: channelSymKey,
        sig: senderId,
        ttl: TTL,
        topic: topic,
        payload: content,
        powTime: POW_TIME,
        powTarget: POW_TARGET
      });
    } catch (err) {
      console.log(err);
    }

    // Store message in database
    let time = await Math.floor(Date.now() / 1000);
    let doc = await Message.findOneAndUpdate(
      { _id: hash },
      {
        _id: hash,
        messageType: 'public',
        recipientId: channelSymKey,
        senderId: senderId,
        ttl: TTL,
        topic: topic,
        payload: messageContent,
        pow: POW_TARGET,
        sentDate: time
      },
      { upsert: true, new: true }
    );
    return doc;
  }

  async createSymmetricKey(password = '', topic = '') {
    // Set password to default if not provided
    let myTopic = topic || this.web3.utils.randomHex(4)
    let pw = password || this.web3.utils.randomHex(20);
    let keyId = await this.web3.shh.generateSymKeyFromPassword(pw);
    await this.subscribeToPublicMessages(keyId, myTopic);
    let time = await Math.floor(Date.now() / 1000);
    let doc = await SymmetricKey.findOneAndUpdate(
      { _id: keyId },
      {
        _id: keyId,
        keyId: keyId,
        description: '',
        topic: myTopic,
        created: time
      },
      { upsert: true, new: true }
    );
    return doc;
  }

  async checkMessageContent(data) {
    let content = await this.web3.utils.toAscii(data.payload);
    // Check if this is a JSON structured message
    let [isJSON, messageObj] = await utils.hasJsonStructure(content);
    if (isJSON && messageObj.type === 'delivery_receipt') {
      // Check if receipt came from original recipient
      let originalMessage = await Message.findOne({ _id: messageObj.messageId });
      if (!originalMessage) {
        throw new Error(`Original message id (${messageObj.messageId}) not found. Cannot add delivery receipt.`);
      } else if (originalMessage.recipientId === data.sig) {
        return await Message.findOneAndUpdate(
          { _id: messageObj.messageId },
          { deliveredDate: messageObj.deliveredDate },
          { upsert: false, new: true }
        );
      }
    } else {
      let doc = await Message.findOneAndUpdate(
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
          sentDate: data.timestamp
        },
        { upsert: true, new: true }
      );

      // Send delivery receipt back to sender
      let time = await Math.floor(Date.now() / 1000);
      let receiptObject = {
        type: 'delivery_receipt',
        deliveredDate: time,
        messageId: data.hash,
      };
      let receiptString = JSON.stringify(receiptObject);
      await this.sendPrivateMessage(data.recipientPublicKey, data.sig, undefined, receiptString);
      return doc;
    }
  }

  async subscribeToPublicMessages(keyId, topic = DEFAULT_TOPIC) {
    // Subscribe to public chat messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      symKeyID: keyId,
      topics: [topic]
    }).on('data', async (data) => {
      // TODO check if sender is in my contacts before processing
      await this.checkMessageContent(data);
    }).on('error', (err) => {
      console.log(err);
    });
  }

  async subscribeToPrivateMessages(userId, topic = DEFAULT_TOPIC) {
    // Find this identity in Mongo so we can get the associated keyId
    let whisperId = await Identity.findOne({ _id: userId });
    // Subscribe to private messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      privateKeyID: whisperId.keyId,
      topics: [topic]
    }).on('data', async (data) => {
      // TODO check if sender is in my contacts before processing
      await this.checkMessageContent(data);
    }).on('error', (err) => {
      console.log(err);
    });
  }
}

module.exports = WhisperWrapper;
