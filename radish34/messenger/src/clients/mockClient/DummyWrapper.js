const Identity = require('../../db/models/Identity');
const Message = require('../../db/models/Message');
const generalUtils = require('../../utils/generalUtils');

class DummyWrapper {
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
    return { publicKey: 'foo', createdDate: Math.floor(Date.now() / 1000) };
  }

  // Load previously created Whisper IDs from database into Whisper node
  // Optional hook to load messaging identities into the client
  async loadIdentities() {
    const identities = await Identity.find({});
    identities.forEach(async (id) => {
      try {
        // do something with the identity
      } catch (err) {
        // do something with error
      }
    });
  }

  async checkMessageContent(data) {
    return ({});
  }

  async sendDeliveryReceipt(data) {

  }

  async subscribeToPrivateMessages(userId, topic = DEFAULT_TOPIC) {

  }
}

module.exports = DummyWrapper;
