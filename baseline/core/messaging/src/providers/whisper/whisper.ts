import logger from 'winston';

import { Identity } from '../../../../../../radish34/messenger/src/db/models/Identity';
import { Message } from '../../../../../../radish34/messenger/src/db/models/Message';

import { forwardMessage, hasJsonStructure, storeNewMessage } from '../../../../../../radish34/messenger/src/utils/generalUtils';
import { getWeb3, isWeb3Connected } from './web3Utils';

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

export class WhisperService {

  constructor() { }

  // If the Identities collection is empty, create a new Identity
  async createFirstIdentity() {
    const identities = await Identity.find({});
    if (identities.length === 0) {
      await this.createIdentity();
    }
  }

  // Create a new whisper identity
  async createIdentity(): Promise<any> {
    const web3 = await getWeb3();
    const keyId = await web3.shh.newKeyPair();
    const pubKey = await web3.shh.getPublicKey(keyId);
    this.subscribe(DEFAULT_TOPIC, pubKey, this.checkMessageContent);

    return {
      keyId: keyId,
      publicKey: await web3.shh.getPublicKey(keyId),
    };
  }

  async isConnected(): Promise<any> {
    return isWeb3Connected();
  }

  // Load previously created Whisper IDs from database into Whisper node
  async loadIdentities() {
    const identities = await Identity.find({});
    identities.forEach(async (id) => {
      try {
        const web3 = await getWeb3();
        const keyId = await web3.shh.addPrivateKey(id.privateKey);
        const pubKey = await web3.shh.getPublicKey(keyId);
        // keyId will change so need to update that in Mongo
        await Identity.findOneAndUpdate(
          { _id: pubKey },
          { keyId },
          { new: true },
        );
        await this.subscribe(DEFAULT_TOPIC, pubKey, this.checkMessageContent);
      } catch (err) {
        logger.error(
          `Error adding public key ${id.publicKey} to Whisper node: ${err}`,
        );
      }
    });
  }

  async checkMessageContent(data) {
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
        this.sendDeliveryReceipt(data);
      }
      // Append source message ID to the object for tracking inbound
      // messages from partners via the messenger API
      messageObj.messageId = data.hash;
      // Adding sender Id to message to know who sent the message
      messageObj.senderId = data.sig;
      // Send all JSON messages to processing service
      forwardMessage(messageObj);
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
    await this.publish(
      undefined,
      receiptString,
      data.recipientPublicKey,
      data.sig,
    );
  }

  async publish(
    subject = DEFAULT_TOPIC,
    payload: any,
    senderId: any,
    recipientId: any,
  ): Promise<any> {
    let messageString = payload;
    if (typeof payload === 'object') {
      messageString = JSON.stringify(payload);
    }

    const web3 = await getWeb3();
    const content = web3.utils.fromAscii(messageString);
    const whisperId = await Identity.findOne({ _id: senderId });
    const { keyId } = whisperId;

    try {
      const messageObj = {
        pubKey: recipientId,
        sig: keyId,
        ttl: TTL,
        topic: subject,
        payload: content,
        powTime: POW_TIME,
        powTarget: POW_TARGET,
      };
      return web3.shh.post(messageObj);
    } catch (err) {
      logger.error('Whisper error:', err);
      return undefined;
    }
  }

  async subscribe(
    subject: string = DEFAULT_TOPIC,
    keyId: string,
    callback: (msg: any) => void,
  ) {
    // Subscribe to private messages
    const web3 = await getWeb3();
    web3.shh
      .subscribe('messages', {
        minPow: POW_TARGET,
        privateKeyID: keyId,
        topics: [subject],
      })
      .on('data', async (data) => {
        try {
          callback(data);
        } catch (error) {
          logger.error(error.message);
        }
      })
      .on('error', (err) => {
        logger.error(err);
      });
  }
}
