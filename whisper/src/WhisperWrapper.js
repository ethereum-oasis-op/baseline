const Web3 = require('web3');
const utils = require("./generalUtils");
const entangleUtils = require("./EntanglementUtils");

// Useful constants
const DEFAULT_TOPIC = "0x11223344";

const POW_TIME = 100;
const TTL = 20;
const POW_TARGET = 2;

class WhisperWrapper {
  constructor(db, gethNodeIP, gethNodePort, flags = {}) {
    const web3 = new Web3();
    // Connect to web3 websocket port
    web3.setProvider(new Web3.providers.WebsocketProvider(`ws://${gethNodeIP}:${gethNodePort}`, { headers: { Origin: 'mychat2' } }));
    this.web3 = web3;
    this.db = db;
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
    let result = await this.db.collection('Identities').findOneAndUpdate(
      { _id: pubKey },
      {
        $set: {
          _id: pubKey,
          publicKey: pubKey,
          privateKey: privKey,
          keyId: keyId,
          created: time
        }
      },
      { upsert: true, returnOriginal: false }
    );

    this.subscribeToPrivateMessages(pubKey, DEFAULT_TOPIC);
    return result.value;
  }

  // Fetch all of the Whisper Identities stored in database
  async getIdentities() {
    let identities = await this.db.collection('Identities').find({}).toArray();
    return identities;
  }

  // Load previously created Whisper IDs from database into Whisper node
  async loadIdentities() {
    let identities = await this.getIdentities();
    identities.forEach(async (id) => {
      try {
        const keyId = await this.web3.shh.addPrivateKey(id.privateKey);
        const pubKey = await this.web3.shh.getPublicKey(keyId);
        // keyId will change so need to update that in Mongo
        await this.db.collection('Identities').findOneAndUpdate(
          { _id: pubKey },
          {
            $set: {
              keyId: keyId
            }
          },
          { returnOriginal: false }
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
    return await this.db.collection('Messages').aggregate([{
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
    let whisperId = await this.db.collection('Identities').findOne({ _id: senderId });
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
    let doc = await this.db.collection('Messages').findOneAndUpdate(
      { _id: hash },
      {
        $set: {
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
        }
      },
      { upsert: true, returnOriginal: false }
    );
    return doc.value;
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
    let doc = await this.db.collection('Messages').findOneAndUpdate(
      { _id: hash },
      {
        $set: {
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
        }
      },
      { upsert: true, returnOriginal: false }
    );
    return doc.value;
  }

  async createSymmetricKey(password = '', topic = '') {
    // Set password to default if not provided
    let myTopic = topic || this.web3.utils.randomHex(4)
    let pw = password || this.web3.utils.randomHex(20);
    let keyId = await this.web3.shh.generateSymKeyFromPassword(pw);
    await this.subscribeToPublicMessages(keyId, myTopic);
    let time = await new Date();
    let doc = await this.db.collection('SymmetricKeys').findOneAndUpdate(
      { _id: keyId },
      {
        _id: keyId,
        keyId: keyId,
        description: '',
        topic: myTopic,
        created: time
      },
      { upsert: true, returnOriginal: true }
    );
    return doc.value;
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
    let whisperId = await this.db.collection('Identities').findOne({ _id: userId });
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
            await this.db.collection('Entanglements').findOneAndUpdate(
              { _id: messageObj._id },
              {
                $set: {
                  _id: messageObj._id,
                  participants: messageObj.participants,
                  blockchain: messageObj.blockchain,
                  created: time
                }
              },
              { upsert: true, returnOriginal: false }
            );
            break;
          case 'entanglement_accept':
            // Update a pre-existing Entanglement to set acceptedRequest to 'true'
            let object = await this.db.collection('Entanglements').findOne({ _id: messageObj._id });
            let userIndex = object.participants.findIndex(({ messengerId }) => messengerId === data.sig);
            object.participants[userIndex].acceptedRequest = true;
            await this.db.collection('Entanglements').findOneAndUpdate(
              { _id: messageObj._id },
              {
                $set: {
                  participants: object.participants,
                  lastUpdated: time
                }
              },
              { returnOriginal: false }
            );
            break;
          case 'entanglement_update':
            entangleUtils.updateEntanglement(messageObj);
            // TODO: check smart contract for updated hashes
            break;
          default:
            console.log('Did not recognize message object type: ', messageObj);
        }
      } else {
        // Store regular messages in Messages collection in Mongo
        await this.db.collection('Messages').findOneAndUpdate(
          { _id: data.hash },
          {
            $set: {
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
            }
          },
          { upsert: true, returnOriginal: false }
        );
      }
      // TODO send acknowledgment
    }).on('error', (err) => {
      console.log(err);
    });
  }
}

module.exports = WhisperWrapper;