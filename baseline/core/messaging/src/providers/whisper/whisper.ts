import { winston as logger } from 'winston';

// const Identity = require('../../../../../../messenger-tmp/src/db/models/Identity');
// const Message = require('../../../../../../messenger-tmp/src/db/models/Message');

const generalUtils = require('../../../../../../messenger-tmp/src/utils/generalUtils');
import { getWeb3, isWeb3Connected as web3Connected } from './web3Utils';

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

export class WhisperService {

  constructor() {}

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
    this.subscribe(DEFAULT_TOPIC, pubKey);

    return {
      keyId: keyId,
      publicKey: await web3.shh.getPublicKey(keyId),
    };
  }

  isConnected(): boolean {
    return await web3Connected();
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
        await this.subscribe(DEFAULT_TOPIC, pubKey);
      } catch (err) {
        logger.error(
          `Error adding public key ${id.publicKey} to Whisper node: ${err}`,
        );
      }
    });
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
