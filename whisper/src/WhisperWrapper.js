const Web3 = require('web3');
const mongoose = require('mongoose');
const Identity = require('./mongoose_models/Identity');
const Message = require('./mongoose_models/Message');
const SymmetricKey = require('./mongoose_models/SymmetricKey');
const Entanglement = require('./mongoose_models/Entanglement');
const utils = require("./generalUtils");
const entangleUtils = require("./entanglementUtils");

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

    // Store key's details in database
    let time = await new Date();
    let result = await Identity.findOneAndUpdate(
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

    this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
    return result;
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
  async getMessages(myId, topic = DEFAULT_TOPIC, whisperId) {
    return await Message.aggregate([{
      $match: {
        $or: [
          { topic: topic, recipientId: myId, senderId: whisperId },
          { topic: topic, recipientId: whisperId, senderId: myId }
        ]
      }
    }]);
  }

  // Send private message
  async sendPrivateMessage(senderId, recipientId, topic = DEFAULT_TOPIC, messageContent) {
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
      return console.error(err);
    }

    // Store message in database
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
    let myTopic = topic || this.web3.utils.randomHex(4)
    let pw = password || this.web3.utils.randomHex(20);
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

  async createEntanglement(doc) {
    let topic = this.web3.utils.randomHex(4);
    let password = this.web3.utils.randomHex(20);
    let keyId = await this.web3.shh.generateSymKeyFromPassword(password);
    await this.subscribeToPublicMessages(keyId, topic);
    const mongooseId = mongoose.Types.ObjectId();
    // Add self as a participant, then add rest of participants listed in req.body
    let participants = [{ whisperId: doc.whisperId, acceptedRequest: true }];
    doc.partnerIds.forEach(whisperId => {
      participants.push({ whisperId: whisperId, acceptedRequest: false });
    });
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
    // Create Entanglement request object to send as Whisper private message
    let entangleRequest = {
      _id: mongooseId,
      type: 'entanglement_request',
      dataField: result.dataField,
      whisper: {
        topic: topic,
        symmetricKey: password
      },
      participants: participants,
      created: time,
      lastUpdated: time
    };
    // Send a private message to each participant inviting them to the entanglement channel
    doc.partnerIds.forEach(async (partnerId) => {
      await this.sendPrivateMessage(doc.whisperId, partnerId, undefined, JSON.stringify(entangleRequest));
    });
    // TODO deploy Consistency smart contract and initiate dataHash
    // Store hash in contract under my Eth address for this dataId
    let hash = entangleUtils.calculateHash(mongooseId);
    return result;
  }

  // Set acceptedRequest for my whisperId to 'true'
  //    whisperId: 0x... (required)
  //    acceptedRequest: Boolean (optional)
  async acceptEntanglement(entanglementId, doc) {
    let time = await new Date();
    let entangleObject = await Entanglement.findOne({ _id: entanglementId });
    let userIndex = await entangleObject.participants.findIndex(({ whisperId }) => whisperId === doc.whisperId);
    entangleObject.participants[userIndex].acceptedRequest = true;
    let result = await Entanglement.findOneAndUpdate(
      { _id: entanglementId },
      {
        participants: entangleObject.participants,
        lastUpdated: time
      },
      { new: true }
    );

    // Create Entanglement request object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_accept',
      lastUpdated: time
    };

    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ whisperId }) => {
      // Don't send message to self
      if (whisperId !== doc.whisperId) {
        await this.sendPrivateMessage(doc.whisperId, whisperId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  //  Update Entanglement dataField object
  //    dataField: {
  //      value: String,
  //      dataId: String,
  //      description: String
  //    },
  //    whisperId: 0x... (required)
  async updateEntanglement(entanglementId, doc) {
    let time = await new Date();
    let entangleObject = await Entanglement.findOne({ _id: entanglementId });
    let result = await Entanglement.findOneAndUpdate(
      { _id: entanglementId },
      {
        "dataField.value": doc.dataField.value || entangleObject.dataField.value,
        "dataField.description": doc.dataField.description || entangleObject.dataField.description,
        lastUpdated: time
      },
      { new: true }
    );

    // Create Entanglement update object to send as Whisper private message
    let entangleMessage = {
      _id: entanglementId,
      type: 'entanglement_update',
      dataField: result.dataField,
      lastUpdated: time
    };

    // TODO: should we send one public message or a separate private message for each participant?
    //     - Probably public so everyone can see the acks? Would have to assume all parties
    //       parties are subscribed to the public channel
    // Send a private message to each participant inviting them to the entanglement channel
    entangleObject.participants.forEach(async ({ whisperId }) => {
      // Don't send message to self
      if (whisperId !== doc.whisperId) {
        await this.sendPrivateMessage(doc.whisperId, whisperId, undefined, JSON.stringify(entangleMessage));
      }
    });
    return result;
  }

  async subscribeToPublicMessages(keyId, topic = DEFAULT_TOPIC) {
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

  async subscribeToPrivateMessages(userId, topic = DEFAULT_TOPIC) {
    // Find this identity in Mongo so we can get the associated keyId
    let whisperId = await Identity.findOne({ _id: userId });
    // Subscribe to private messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      privateKeyID: whisperId.keyId,
      topics: [topic]
    }).on('data', async (data) => {
      let content = await this.web3.utils.toAscii(data.payload);
      let time = await new Date();
      // Check if this is a JSON structured entanglement message
      let [isJSON, messageObj] = await utils.hasJsonStructure(content);
      if (isJSON) {
        switch (messageObj.type) {
          case 'entanglement_request':
            // Create new Entanglement in Mongo
            await Entanglement.findOneAndUpdate(
              { _id: messageObj._id },
              {
                _id: messageObj._id,
                whisper: messageObj.whisper,
                dataField: messageObj.dataField,
                participants: messageObj.participants,
                created: time,
                lastUpdated: time
              },
              { upsert: true, new: true }
            );
            break;
          case 'entanglement_accept':
            // Update a pre-existing Entanglement to set acceptedRequest to 'true'
            let object = await Entanglement.find({ _id: messageObj._id });
            let userIndex = object.participants.findIndex(({ whisperId }) => whisperId === data.sig);
            object.participants[userIndex].acceptedRequest = true;
            await Entanglement.findOneAndUpdate(
              { _id: messageObj._id },
              {
                _id: messageObj._id,
                participants: object.participants,
                lastUpdated: time
              },
              { new: true }
            );
            break;
          case 'entanglement_update':
            // TODO: check smart contract for updated hashes
            break;
          default:
            console.log('Did not recognize message object type: ', messageObj);
        }
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