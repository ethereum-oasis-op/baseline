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
  private keyId: string;
  private recipientId: string;

  constructor(config) {
    this.keyId = config.keyId;
    this.recipientId = config.recipientId;
  }

  async connect() {
    return getWeb3();
  }

  async isConnected(): Promise<any> {
    return isWeb3Connected();
  }

  async publish(
    subject = DEFAULT_TOPIC,
    payload: any,
    reply,
    recipientId: string
  ): Promise<any> {
    let messageString = payload;
    if (typeof payload === 'object') {
      messageString = JSON.stringify(payload);
    }

    const web3 = await getWeb3();
    const content = web3.utils.fromAscii(messageString);

    try {
      const messageObj = {
        pubKey: this.recipientId,
        sig: this.keyId,
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
    callback: (msg: any) => void,
  ) {
    // Subscribe to private messages
    const web3 = await getWeb3();
    web3.shh
      .subscribe('messages', {
        minPow: POW_TARGET,
        privateKeyID: this.keyId,
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

  // Load previously created Whisper IDs from database into Whisper node
  async loadIdentities(identities, topic, callback) {
    let newIdentities = [];
    if (identities.length === 0) {
      this.createIdentity(topic, callback);
    } else {
      identities.forEach(async (id) => {
        try {
          const web3 = await getWeb3();
          const keyId = await web3.shh.addPrivateKey(id.privateKey);
          const publicKey = await web3.shh.getPublicKey(keyId);
          newIdentities.push({ publicKey, keyId });
          await this.subscribe(topic = DEFAULT_TOPIC, callback);
        } catch (err) {
          logger.error(
            `Error adding public key ${id.publicKey} to Whisper node: ${err}`,
          );
        }
      });
    }
    return newIdentities;
  }

  async createIdentity(topic = DEFAULT_TOPIC, callback) {
    // Create new public/private key pair
    const web3 = await getWeb3();
    const keyId = await web3.shh.newKeyPair();
    const publicKey = await web3.shh.getPublicKey(keyId);
    const privateKey = await web3.shh.getPrivateKey(keyId);
    const createdDate = await Math.floor(Date.now() / 1000);

    this.subscribe(topic, callback);
    return { publicKey, privateKey, keyId, createdDate };
  }

}
