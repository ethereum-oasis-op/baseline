import logger from 'winston';
import { getWeb3, isWeb3Connected } from './web3Utils';

// Useful constants
const DEFAULT_CONNECTED_INTERVAL = 2000; // FIXME-- make configurable via env and parseInt via constructor and private ivar
const DEFAULT_TOPIC = process.env.WHISPER_TOPIC || '0x11223344';
const POW_TIME = process.env.WHISPER_POW_TIME || 100;
const TTL = process.env.WHISPER_TTL || 20;
const POW_TARGET = process.env.WHISPER_POW_TARGET || 2;

export class WhisperService {
  public keyId: string;
  private clientUrl: string;
  private connectedInterval: any;
  private web3Connected: boolean; // internal service reference to last-known web3 listener status

  constructor(config) {
    this.keyId = config.keyId;
    this.clientUrl = config.clientUrl;

    this.web3Connected = false;
    this.initConnectedInterval();
  }

  private initConnectedInterval() {
    this.web3Connected = false;
    if (this.connectedInterval) {
      this.stopConnectedInterval();
    }

    this.connectedInterval = setInterval(async () => {
      this.web3Connected = await isWeb3Connected();
    }, DEFAULT_CONNECTED_INTERVAL);
  }

  private stopConnectedInterval() {
    if (this.connectedInterval) {
      clearInterval(this.connectedInterval);
      this.connectedInterval = null;
    }
    this.web3Connected = false;
  }

  async connect() {
    return getWeb3(this.clientUrl);
  }

  async disconnect() {
    if (this.isConnected()) {
      this.stopConnectedInterval();
    }
    return Promise.resolve();
  }

  isConnected(): boolean {
    return this.web3Connected;
  }

  async publish(
    subject = DEFAULT_TOPIC,
    payload: any,
    reply: any,
    recipientId: string,
    senderId: string
  ): Promise<any> {
    let messageString = payload;
    if (typeof payload === 'object') {
      messageString = JSON.stringify(payload);
    }

    const web3 = await getWeb3(this.clientUrl);
    const content = web3.utils.fromAscii(messageString);

    let keyId = this.keyId;
    if (senderId) {
      keyId = senderId;
    }

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
      const hash = await web3.shh.post(messageObj);
      const time = Math.floor(Date.now() / 1000);
      const publicKey = await web3.shh.getPublicKey(keyId);
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
  ): Promise<void> {
    const web3 = await getWeb3(this.clientUrl);
    return web3.shh
      .subscribe('messages', {
        minPow: POW_TARGET,
        privateKeyID: myId,
        topics: [subject],
      })
      .on('data', async (data) => {
        try {
          // Use .call() so that we can pass the Whisper class instance as "this",
          // therefore we can call Whisper class methods. Otherwise "this" is 
          // scoped by callback function.
          callback.call(this, data);
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
  async loadIdentities(identities, topic = DEFAULT_TOPIC, callback) {
    const loadedIds = await new Array<object>();
    if (identities.length === 0) {
      const newId = await this.createIdentity(topic, callback)
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
