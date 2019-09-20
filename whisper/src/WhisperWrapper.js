const Web3 = require('web3');
const mongoose = require('mongoose');
const Identity = require('./mongoose_models/Identity');
const Message = require('./mongoose_models/Message');
const SymmetricKey = require('./mongoose_models/SymmetricKey');
const Entanglement = require('./mongoose_models/Entanglement');
const crypto = require("crypto");
const utils = require("./generalUtils");

// Useful constants
const DEFAULT_TOPIC = "0x11223344";

const POW_TIME = 100;
const TTL = 20;
const POW_TARGET = 2;

class WhisperWrapper {
  constructor(gethNodeIP, gethNodePort, flags = {}) {
    const web3 = new Web3();
    // Connect to web3 websocket port
    web3.setProvider(new Web3.providers.WebsocketProvider(`ws://${gethNodeIP}:${gethNodePort}`, { headers: { Origin: 'mychat2' } }));
    this.web3 = web3;
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
    this.subscribeToPrivateMessages(keyId, DEFAULT_TOPIC);

    // Store key's details in database
    let time = await new Date();
    return await Identity.findOneAndUpdate(
      { _id: pubKey },
      {
        _id: pubKey,
        publicKey: pubKey,
        privateKey: privKey,
        keyId: keyId,
        created: time
      },
      { upsert: true, new: true }
    );
  }

  // Fetch all of the Whisper Identities stored in database
  async getWhisperIds() {
    return await Identity.find({});
  }

  // Load previously created Whisper IDs from database into Whisper node
  async loadWhisperIds() {
    let identities = await this.getWhisperIds();
    identities.forEach(async (id) => {
      try {
        const keyId = await this.web3.shh.addPrivateKey(id.privateKey);
        const pubKey = await this.web3.shh.getPublicKey(keyId);
        await this.subscribeToPrivateMessages(keyId, DEFAULT_TOPIC);
        console.log(`Added public key ${id.publicKey} with keyId ${keyId} to Whisper node.`);
        // keyId will change so need to update that in Mongo
        await Identity.findOneAndUpdate(
          { _id: pubKey },
          {
            keyId: keyId
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error(`Error adding public key ${id.publicKey} to Whisper node: ${err}`);
      }
    });
  }

  // Fetch messages for a given conversation
  // Private conversation = all messages with same topic and same two Whisper Ids
  async getMessages(myId, topic = DEFAULT_TOPIC, contactId) {
    return await Message.aggregate([{
      $match: {
        $or: [
          { topic: topic, recipientId: myId, senderId: contactId },
          { topic: topic, recipientId: contactId, senderId: myId }
        ]
      }
    }]);
  }

  // Send private message
  async sendPrivateMessage(senderKeyId, recipientId, topic = DEFAULT_TOPIC, messageContent) {
    let content = await this.web3.utils.fromAscii(messageContent);
    let hash;
    try {
      hash = await this.web3.shh.post({
        pubKey: recipientId,
        sig: senderKeyId,
        ttl: TTL,
        topic: topic,
        payload: content,
        powTime: POW_TIME,
        powTarget: POW_TARGET
      });
    } catch (err) {
      return console.error(err);
    }

    // Store message in database
    const senderId = await this.web3.shh.getPublicKey(senderKeyId);
    let time = await new Date();
    return await Message.findOneAndUpdate(
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
        ack_rcvd: false,
        timestamp: time
      },
      { upsert: true, new: true }
    );
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
    let time = await new Date();
    return await Message.findOneAndUpdate(
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
        ack_rcvd: false,
        timestamp: time
      },
      { upsert: true, new: true }
    );
  }

  async createSymmetricKey(password = '', topic = '') {
    // Set password to default if not provided
    let myTopic = topic || crypto.randomBytes(4).toString('hex')
    let pw = password || crypto.randomBytes(20).toString('hex');
    let keyId = await this.web3.shh.generateSymKeyFromPassword(pw);
    await this.subscribeToPublicMessages(keyId, myTopic);
    let time = await new Date();
    return await SymmetricKey.findOneAndUpdate(
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
  }

  async createEntanglement(senderKeyId, doc) {
    let topic = crypto.randomBytes(4).toString('hex');
    topic = '0x' + topic; // web3.shh requires 0x prefix
    let password = crypto.randomBytes(20).toString('hex');
    let keyId = await this.web3.shh.generateSymKeyFromPassword(password);
    await this.subscribeToPublicMessages(keyId, topic);
    const mongooseId = mongoose.Types.ObjectId();
    let participants = [];
    doc.participants.forEach(contactId => {
      participants.push({ contactId: contactId, acceptedRequest: false });
    })
    let time = await new Date();
    let result = await Entanglement.findOneAndUpdate(
      { _id: mongooseId },
      {
        _id: mongooseId,
        whisper: {
          topic: topic,
          symmetricKeyId: keyId,
          symmetricKey: password
        },
        dataField: {
          value: doc.dataField.value,
          dataId: doc.dataField.dataId,
          description: doc.dataField.description
        },
        participants: participants,
        created: time,
        lastUpdated: time
      },
      { upsert: true, new: true }
    );
    // Create entangle request object to send as Whisper message
    let entangleRequest = {
      _id: mongooseId,
      type: 'entanglement_request',
      dataField: result.dataField,
      whisper: {
        topic: topic,
        symmetricKey: password
      }
    };
    // Send a private message to each participant inviting them to the entanglement channel
    doc.participants.forEach(async (contactId) => {
      await this.sendPrivateMessage(senderKeyId, contactId, result.whisper.topic, JSON.stringify(entangleRequest));
    });
    return result;
  }

  async subscribeToPublicMessages(keyId, topic = DEFAULT_TOPIC) {
    // Set default values if not provided
    // Subscribe to public chat messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      symKeyID: keyId,
      topics: [topic]
    }).on('data', async (data) => {
      // TODO store message in database
      console.log(data.sig, this.web3.utils.toAscii(data.payload));
    }).on('error', (err) => {
      console.log(err);
    });
  }

  async subscribeToPrivateMessages(keyId, topic = DEFAULT_TOPIC) {
    // Subscribe to private messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      privateKeyID: keyId,
      topics: [topic]
    }).on('data', async (data) => {
      let content = await this.web3.utils.toAscii(data.payload);
      // Check if this is an entanglement_request message
      let isJSON = await utils.hasJsonStructure(content);
      if (isJSON && content.type === 'entanglement_request') {
        // Store in Entanglements collection in Mongo
        await Entanglement.findOneAndUpdate(
          { _id: mongooseId },
          {
            _id: mongooseId,
            whisper: {
              topic: content.whisper.topic,
              symmetricKeyId: content.whisper.symmetricKeyId,
              symmetricKey: content.whisper.symmetricKey
            },
            dataField: {
              value: content.dataField.value,
              dataId: content.dataField.dataId,
              description: content.dataField.description
            },
            participants: content.participants,
            created: content.time,
            lastUpdated: content.time
          },
          { upsert: true, new: true }
        );
      } else {
        // Store regular messages in Messages collection in Mongo
        await Message.findOneAndUpdate(
          { _id: data.hash },
          {
            _id: data.hash,
            messageType: 'private',
            recipientId: data.recipientPublicKey,
            senderId: data.sig,
            ttl: data.ttl,
            topic: data.topic,
            payload: content,
            pow: data.pow,
            ack_rcvd: false,
            timestamp: data.timestamp
          },
          { upsert: true, new: true }
        );
      }
      // TODO send acknowledgment
    }).on('error', (err) => {
      console.log(err);
    });
  }
}

module.exports = WhisperWrapper;