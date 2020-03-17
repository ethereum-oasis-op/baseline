const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const Config = require('../config');
const WhisperWrapper = require('../src/clients/whisper/WhisperWrapper.js');
const web3utils = require('../src/clients/whisper/web3Utils.js');
const generalUtils = require('../src/utils/generalUtils.js');
const { decrypt } = require('../src/utils/encryptUtils.js');
const { receiveMessageQueue } = require('../src/queues/receiveMessage/index.js');

const Identity = require('../src/db/models/Identity');
const Message = require('../src/db/models/Message');

let nativeClient;
let db;

beforeAll(async () => {
  generalUtils.forwardMessage = jest.fn();

  // Create mongoose connection to db
  await mongoose.connect(Config.users[0].dbUrl, Config.mongoose);
  await Identity.deleteMany();
  await Message.deleteMany();

  // Create native mongo connection to db
  nativeClient = await MongoClient.connect(Config.users[0].dbUrl, { useUnifiedTopology: true });
  db = nativeClient.db();
});

afterAll(async () => {
  await mongoose.connection.close();
  await nativeClient.close();
});

let messenger;
let whisperId;

describe('WhisperWrapper', () => {
  beforeAll(async () => {
    messenger = await new WhisperWrapper();
  });

  describe('Identities', () => {
    test('getIdentities() returns empty array', async () => {
      const result = await messenger.getIdentities();
      expect(result).toEqual([]);
    });

    test('createIdentity() returns new identity', async () => {
      const result = await messenger.createIdentity();
      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('createdDate');
      whisperId = result;
    });

    test('getIdentities() returns identity', async () => {
      const result = await messenger.getIdentities();
      expect(result[0]).toEqual(whisperId);
    });

    describe('Check encryption', () => {
      test('Whisper privateKey should be encrypted at-rest in Mongo', async () => {
        const mongooseResult = await Identity.find({});
        const rawMongoResult = await db.collection('Identities').find({}).toArray();
        expect(mongooseResult[0].publicKey).toEqual(rawMongoResult[0].publicKey);
        expect(mongooseResult[0].privateKey).not.toEqual(rawMongoResult[0].privateKey);
        const decrypted = await decrypt(rawMongoResult[0].privateKey);
        expect(mongooseResult[0].privateKey).toEqual(decrypted);
      });
    });

  });

  describe('Messages', () => {
    const fakeWhisperId = '0x044e81e2bea10065e88b5a5da34898b55fad6366d32d371852f1e11055ba82be109fbd60b07e1b23f35f6371b9605d79c22bbf63e6cc2718eca58446a0f07cb9c1';
    let messageId;

    describe('send messages', () => {
      test('sendPrivateMessage() creates message from string', async () => {
        const messageContent = 'Test message 101';
        const result = await messenger.sendPrivateMessage(
          whisperId.publicKey,
          fakeWhisperId,
          undefined,
          messageContent,
        );
        expect(result.payload).toEqual(messageContent);
      });

      test('sendPrivateMessage() creates message from JSON', async () => {
        const messageContent = {
          type: 'test_message',
          content: 'testing 123',
        };
        const result = await messenger.sendPrivateMessage(
          whisperId.publicKey,
          fakeWhisperId,
          undefined,
          messageContent,
        );
        messageId = result._id;
        expect(JSON.parse(result.payload)).toEqual(messageContent);
      });
    });

    describe('receive messages', () => {
      test('checkMessageContent() processes message with string payload', async () => {
        const messageString = 'testing 456';
        const web3 = await web3utils.getWeb3();
        const messageHex = await web3.utils.fromAscii(messageString);
        const messageObj = {
          sig: fakeWhisperId,
          ttl: 20,
          timestamp: 1576249522,
          topic: '0x11223344',
          payload: messageHex,
          padding:
            '0xd44a23ee598fc4d317e1be194f3999b0433ddf8142925f6c5df7565ec8a3aae3a2d0855079e90ba38946c2d3a6cc8e35eeb80f1ab63f',
          pow: 3.5,
          hash:
            '0x0e9e3579c5feb24f8d160684f274d22ecdb15dff750420f32fa40e76f30cb40b',
          recipientPublicKey: whisperId.publicKey,
        };

        const result = await messenger.checkMessageContent(messageObj);
        expect(result.payload).toEqual(messageString);
      });

      test("checkMessageContent() does not process 'delivery_receipt' if original message does not exist", async () => {
        const rawObj = {
          type: 'delivery_receipt',
          deliveredDate: 1576249522,
          origMessageId: '0x123',
        };
        const web3 = await web3utils.getWeb3();
        const messageHex = await web3.utils.fromAscii(JSON.stringify(rawObj));
        const messageObj = {
          sig: fakeWhisperId,
          ttl: 20,
          timestamp: 1576249522,
          topic: '0x11223344',
          payload: messageHex,
          padding:
            '0xd44a23ee598fc4d317e1be194f3999b0433ddf8142925f6c5df7565ec8a3aae3a2d0855079e90ba38946c2d3a6cc8e35eeb80f1ab63f',
          pow: 3.5,
          hash:
            '0x0e9e3579c5feb24f8d160684f274d22ecdb15dff750420f32fa40e76f30cb40b',
          recipientPublicKey: whisperId.publicKey,
        };

        let result;
        let error = false;
        try {
          result = await messenger.checkMessageContent(messageObj);
        } catch (err) {
          error = true;
          result = err.message;
        }
        expect(error).toEqual(true);
        expect(result).toEqual(
          `Original message id (${rawObj.origMessageId}) not found. Cannot add delivery receipt.`,
        );
      });

      test("checkMessageContent() processes 'delivery_receipt' if original message exists", async () => {
        const rawObj = {
          type: 'delivery_receipt',
          deliveredDate: 1576249522,
          origMessageId: messageId,
        };
        const web3 = await web3utils.getWeb3();
        const messageHex = await web3.utils.fromAscii(JSON.stringify(rawObj));
        const messageObj = {
          sig: fakeWhisperId,
          ttl: 20,
          timestamp: 1576249522,
          topic: '0x11223344',
          payload: messageHex,
          padding:
            '0xd44a23ee598fc4d317e1be194f3999b0433ddf8142925f6c5df7565ec8a3aae3a2d0855079e90ba38946c2d3a6cc8e35eeb80f1ab63f',
          pow: 3.5,
          hash:
            '0x0e9e3579c5feb24f8d160684f274d22ecdb15dff750420f32fa40e76f30cb40b',
          recipientPublicKey: whisperId.publicKey,
        };

        let result;
        let error = false;
        try {
          result = await messenger.checkMessageContent(messageObj);
        } catch (err) {
          error = true;
          result = err.message;
        }
        expect(error).toEqual(false);
        expect(result.deliveredDate).not.toBeUndefined();
      });

    });
  });
});
