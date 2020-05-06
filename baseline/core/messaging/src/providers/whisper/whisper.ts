import logger from 'winston';
import { getWeb3, isWeb3Connected } from './web3Utils';

// Useful constants
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

export class WhisperService {
  public keyId: string;
  private clientUrl: string;

  constructor(config) {
    this.keyId = config.keyId;
    this.clientUrl = config.clientUrl;
  }

  async connect() {
    return getWeb3(this.clientUrl);
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

    const web3 = await getWeb3(this.clientUrl);
    const content = web3.utils.fromAscii(messageString);

    try {
      const messageObj = {
        pubKey: recipientId,
        sig: this.keyId,
        ttl: TTL,
        topic: subject,
        payload: content,
        powTime: POW_TIME,
        powTarget: POW_TARGET,
      };
      const hash = await web3.shh.post(messageObj);
      const time = Math.floor(Date.now() / 1000);
      const publicKey = await web3.shh.getPublicKey(this.keyId);
      return {
        payload: messageString,
        _id: hash,
        hash,
        recipientPublicKey: recipientId,
        sig: publicKey,
        ttl: messageObj.ttl,
        topic: messageObj.topic,
        pow: POW_TARGET,
        timestamp: time
      };
    } catch (err) {
      logger.error('Whisper publish error:', err);
    }
  }

  // Subscribe to enable receiving of new messages
  async subscribe(
    subject: string = DEFAULT_TOPIC,
    callback: (msg: any) => void,
    myId: string
  ) {
    const web3 = await getWeb3(this.clientUrl);
    web3.shh
      .subscribe('messages', {
        minPow: POW_TARGET,
        privateKeyID: myId,
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

  // Load any previously created Whisper IDs from database into Whisper node
  // If no existing IDs provided, create a new one
  async loadIdentities(identities, topic, callback) {
    let loadedIds = await new Array<object>();
    if (identities.length === 0) {
      let newId = await this.createIdentity(topic, callback)
      loadedIds.push(newId);
    } else {
      const web3 = await getWeb3(this.clientUrl);
      await Promise.all(identities.map(async id => {
        try {
          const keyId = await web3.shh.addPrivateKey(id.privateKey);
          const publicKey = await web3.shh.getPublicKey(keyId);
          loadedIds.push({ publicKey, keyId });
          await this.subscribe(topic, callback, keyId);
        } catch (err) {
          logger.error(
            `Error adding public key ${id.publicKey} to Whisper node: ${err}`,
          );
        }
      }));
    };
    this.keyId = loadedIds[0]['keyId'];
    return loadedIds;
  }

  async createIdentity(topic = DEFAULT_TOPIC, callback) {
    // Create new public/private key pair
    const web3 = await getWeb3(this.clientUrl);
    const keyId = await web3.shh.newKeyPair();
    const publicKey = await web3.shh.getPublicKey(keyId);
    const privateKey = await web3.shh.getPrivateKey(keyId);
    const createdDate = await Math.floor(Date.now() / 1000);

    await this.subscribe(topic, callback, keyId);
    this.keyId = keyId;
    return { publicKey, privateKey, keyId, createdDate };
  }

}
