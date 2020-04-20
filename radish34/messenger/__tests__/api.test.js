const request = require('supertest');
const mongoose = require('mongoose');
const Config = require('../config');
const generalUtils = require('../src/utils/generalUtils.js');

const Identity = require('../src/db/models/Identity');
const Message = require('../src/db/models/Message');

const { ipAddress, apiPort } = Config.users[0];
const apiRequest = request(`${ipAddress}:${apiPort}`);

beforeAll(async () => {
  await mongoose.connect(Config.users[0].dbUrl, Config.mongoose);
  await Identity.deleteMany();
  await Message.deleteMany();
  generalUtils.forwardMessage = jest.fn();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('/health', () => {

  test('GET /health returns 200', async () => {
    const res = await apiRequest.get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.connected).toEqual(true);
    expect(res.body.type).toEqual(Config.messagingType);
  });
});

describe('/identities', () => {
  // Assumption that the test DB is empty from setupDB test helper
  describe('When no identities exist', () => {
    beforeEach(async () => {
      await Identity.deleteMany();
    });

    test('GET /identities returns an empty array', async () => {
      const res = await apiRequest.get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
      expect(res.body.length).toEqual(0);
    });
  });

  test('POST /identities to create a new one', async () => {
    const res = await apiRequest
      .post('/api/v1/identities')
      .send({}); // no attributes required
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('publicKey');
    expect(res.body).toHaveProperty('createdDate');
  });

  test('GET /identities returns identities', async () => {
    const res = await apiRequest.get('/api/v1/identities');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('/messages', () => {
  test('GET /messages returns 400 without id in header', async () => {
    const res = await apiRequest.get('/api/v1/messages');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(
      "Valid messenger identity not provider in 'x-messenger-id' header.",
    );
  });

  describe('Using an identityId header in the request', () => {
    let messengerId;

    beforeAll(async (done) => {
      const res = await apiRequest
        .post('/api/v1/identities')
        .send({}); // no attributes required
      // Setting the messengerID used as context for the rest of the tests below
      messengerId = res.body.publicKey;
      done();
    });

    describe('When no messages exist for an identity', () => {
      // Assumes an empty test db
      test('GET /messages returns empty array', async () => {
        const res = await apiRequest
          .get('/api/v1/messages')
          .set('x-messenger-id', messengerId);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
      });
    });

    describe('Creating a new message', () => {
      test('POST /messages returns 400 without id in header', async () => {
        const res = await apiRequest
          .post('/api/v1/messages')
          .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual(
          "Valid messenger identity not provider in 'x-messenger-id' header.",
        );
      });

      test('POST /messages returns 400 withOUT required attributes', async () => {
        const res = await apiRequest
          .post('/api/v1/messages')
          .set('x-messenger-id', messengerId)
          .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual(
          'Request body must contain following fields: payload, recipientId',
        );
      });

      test('POST /messages creates new message with required attributes', async () => {
        const res = await apiRequest
          .post('/api/v1/messages')
          .set('x-messenger-id', messengerId)
          .send({
            recipientId: messengerId,
            payload: 'Message 1',
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body.payload).toEqual('Message 1');
      });
    });

    describe('Retrieving an existing message', () => {
      let messageId;

      beforeAll(async (done) => {
        const newRes = await apiRequest
          .post('/api/v1/messages')
          .set('x-messenger-id', messengerId)
          .send({
            recipientId: messengerId,
            payload: 'Message 123',
          });
        messageId = newRes.body._id;
        done();
      });

      test('GET /messages/:messageId returns 400 without id in header', async () => {
        const res = await apiRequest.get(
          `/api/v1/messages/${messageId}`,
        );
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual(
          "Valid messenger identity not provider in 'x-messenger-id' header.",
        );
      });

      test('GET /messages/:messageId returns 404 if message doesnt exist', async () => {
        const fakeMessageId = '0x0';
        const res = await apiRequest
          .get(`/api/v1/messages/${fakeMessageId}`)
          .set('x-messenger-id', messengerId);
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual(
          `Message with id ${fakeMessageId} was not found.`,
        );
      });

      test('GET /messages/:messageId retrieves created message', async () => {
        const res = await apiRequest
          .get(`/api/v1/messages/${messageId}`)
          .set('x-messenger-id', messengerId);

        expect(res.statusCode).toEqual(200);
        const message = res.body;
        expect(message.id).not.toBeUndefined();
        expect(message.scope).toEqual('individual');
        expect(message.senderId).toEqual(messengerId);
        expect(message.sentDate).not.toBeUndefined();
        expect(message.recipientId).toEqual(messengerId); // sent message to self
        expect(message.deliveredDate).toBeUndefined();
        expect(message.payload).toEqual('Message 123');
      });
    });

    describe('Retrieving and filtering multiple messages', () => {
      let messageCount;

      test('GET /messages returns messages withOUT "since" query param', async () => {
        // create a message
        await apiRequest
          .post('/api/v1/messages')
          .set('x-messenger-id', messengerId)
          .send({
            recipientId: messengerId,
            payload: 'Message Test 1',
          });

        const res = await apiRequest
          .get('/api/v1/messages')
          .set('x-messenger-id', messengerId);

        messageCount = res.body.length;
        expect(res.statusCode).toEqual(200);
        expect(messageCount).toBeGreaterThan(0);
        const message = res.body[0];
        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('scope');
        expect(message).toHaveProperty('senderId');
        expect(message).toHaveProperty('sentDate');
        expect(message).toHaveProperty('recipientId');
        expect(message).toHaveProperty('payload');
      });

      test('GET /messages returns messages WITH "since" query param', async () => {
        const res = await apiRequest
          .get('/api/v1/messages?since=0')
          .set('x-messenger-id', messengerId);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(messageCount);
      });

      test('GET /messages returns messages WITH "since" AND "partnerId" query param', async () => {
        const newPartner = '0x04d54e2219adad9576cee1684b6f9a609ab29cc1a4ec3dfc0f1746b05aba99fb208f58771f4f9a1390d0cabede08ae115f6f1806ccabc4681677fd7d5bdf13b03e';
        // create a message for new recipientId
        await apiRequest
          .post('/api/v1/messages')
          .set('x-messenger-id', messengerId)
          .send({
            recipientId: newPartner,
            payload: 'Hello new partner, nice to meet you!',
          });

        const res = await apiRequest
          .get(`/api/v1/messages?since=0&partnerId=${newPartner}`)
          .set('x-messenger-id', messengerId);

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
      });
    });
  });
});
