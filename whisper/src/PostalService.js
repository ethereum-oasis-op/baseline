const Web3 = require('web3');

// Useful constants
const DEFAULT_CHANNEL = "default";
const DEFAULT_TOPIC = "0x11223344";

const POW_TIME = 100;
const TTL = 20;
const POW_TARGET = 2;

class PostalService {
  constructor(gethNodeIP, gethNodePort, flags = {}) {
    const web3 = new Web3();
    // Connect to web3 websocket port
    web3.setProvider(new Web3.providers.WebsocketProvider(`ws://${gethNodeIP}:${gethNodePort}`, { headers: { Origin: 'mychat2' } }));
    this.web3 = web3;
  }

  // Fetch all of the Whisper Identities previously created and stored in database
  async loadWhisperIds() {
    let whisperIds = db.fetchWhisperIds();
    whisperIds.forEach(id => {
      this.identities.push(id);
    });
  }

  // Call this function before sending Whisper commands
  async isConnected() {
    let connected = await this.web3.eth.net.isListening();
    this.connected = connected;
    return connected;
  }

  async sendPrivateMessage(senderId, recipientId, topic = DEFAULT_TOPIC, messageContent) {
    // Send private message
    try {
      this.web3.shh.post({
        pubKey: recipientId,
        sig: senderId,
        ttl: TTL,
        topic: topic,
        payload: this.web3.utils.fromAscii(messageContent),
        powTime: POW_TIME,
        powTarget: POW_TARGET
      });
    } catch (err) {
      console.log(err);
    }
    // TODO store message in database

  }

  async sendPublicMessage(senderId, topic = DEFAULT_TOPIC) {
    // Send a public message
    try {
      this.web3.shh.post({
        symKeyID: channelSymKey,
        sig: senderId,
        ttl: TTL,
        topic: topic,
        payload: web3.utils.fromAscii(message),
        powTime: POW_TIME,
        powTarget: POW_TARGET
      });
    } catch (err) {
      console.log(err);
    }
  }

  async createIdentity() {
    const keyId = await this.web3.shh.newKeyPair();
    // Obtain public key
    const pubKey = await this.web3.shh.getPublicKey(keyPair);
    const privKey = await this.web3.shh.getPublicKey(keyPair);
    // TODO Store key's details in database
    let identity = { keyId: keyId, publicKey: pubKey, privateKey: privKey };
  }

  async createSymmetricKey(password) {
    // Set password to default if not provided
    let pw = password || DEFAULT_CHANNEL;
    const channelSymKey = await this.web3.shh.generateSymKeyFromPassword(pw);
  }

  async subscribeToPublicMessages(keyId, topic) {
    // Set default values if not provided
    let symKey = keyId || this.identities[0];
    let channelTopic = topic || DEFAULT_TOPIC;
    // Subscribe to public chat messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      symKeyID: symKey,
      topics: [channelTopic]
    }).on('data', (data) => {
      // TODO store message in database
      console.log(data.sig, this.web3.utils.toAscii(data.payload));
    }).on('error', (err) => {
      console.log(err);
    });
  }

  async subscribeToPrivateMessages(keyId, topic) {
    // Set default values if not provided
    let keyPair = keyId || this.identities[0].keyId;
    let channelTopic = topic || DEFAULT_TOPIC;
    // Subscribe to private messages
    this.web3.shh.subscribe("messages", {
      minPow: POW_TARGET,
      privateKeyID: keyPair,
      topics: [channelTopic]
    }).on('data', (data) => {
      // TODO store message in database
      console.log(data.sig, this.web3.utils.toAscii(data.payload));
    }).on('error', (err) => {
      console.log(err);
    });
  }
}