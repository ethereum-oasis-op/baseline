const request = require('supertest');
// TODO: Use config to pass db config for test env to setupDb
const Config = require('../config');

const mongoose = require('mongoose')
const Identity = require('../src/models/Identity');
const Message = require('../src/models/Message');

const buyerURL = `http://localhost:4001`;

beforeAll(async () => {
  mongoose.connect('mongodb://localhost:27017/radish34');
  await Identity.deleteMany();
  await Message.deleteMany();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe('/identities', () => {

  // Assumption that the test DB is empty from setupDB test helper
  describe('When no identities exist', () => {

    test('GET /identities returns an empty array', async () => {
      const res = await request(buyerURL)
        .get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
      expect(res.body.length).toEqual(0);
    });
  });

  test('POST /identities to create a new one', async () => {
    const res = await request(buyerURL)
      .post('/api/v1/identities')
      .send({}); //no attributes required
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('publicKey');
    expect(res.body).toHaveProperty('createdDate');
  });

  test('GET /identities returns identities', async () => {
    const res = await request(buyerURL)
      .get('/api/v1/identities');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

});

describe('/messages', () => {

  test('GET /messages returns 400 without id in header', async () => {
    const res = await request(buyerURL)
      .get(`/api/v1/messages`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Valid messenger identity not provider in 'x-messenger-id' header.");
  });

  describe('Using an identityId header in the request', () => {
    let buyerId;

    beforeAll(async(done) => {
      const res = await request(buyerURL)
      .post('/api/v1/identities')
      .send({}); //no attributes required
      // Setting the buyerID used as context for the rest of the tests below
      buyerId = res.body.publicKey;
      done();
    });

    describe('When no messages exist for an identity', () => {

      // Assumes an empty test db
      test('GET /messages returns empty array', async () => {
        const res = await request(buyerURL)
          .get(`/api/v1/messages`)
          .set('x-messenger-id', buyerId);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
      });
    });

    describe('Creating a new message', () => {

      test('POST /messages returns 400 withOUT required attributes', async () => {
        const res = await request(buyerURL)
          .post('/api/v1/messages')
          .set('x-messenger-id', buyerId)
          .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Request body must contain following fields: payload, recipientId');
      });

      test('POST /messages creates new message with required attributes', async () => {
        const res = await request(buyerURL)
          .post('/api/v1/messages')
          .set('x-messenger-id', buyerId)
          .send({
            recipientId: buyerId,
            payload: 'Message 1'
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body.payload).toEqual('Message 1');
      });
    });

    describe('Retrieving an existing message', () => {
      let messageId; 

      beforeAll(async (done) => {
        const newRes = await request(buyerURL)
          .post('/api/v1/messages')
          .set('x-messenger-id', buyerId)
          .send({
            recipientId: buyerId,
            payload: 'Message 123'
          });

        messageId = newRes.body._id;
        done();
      });

      test('GET /messages/:messageId returns 404 if message doesnt exist', async () => {
        let fakeMessageId = '0x0';
        const res = await request(buyerURL)
          .get(`/api/v1/messages/${fakeMessageId}`)
          .set('x-messenger-id', buyerId);
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual(`Message with id ${fakeMessageId} was not found.`);
      });

      test('GET /messages/:messageId retrieves created message', async () => {
        const res = await request(buyerURL)
                .get(`/api/v1/messages/${messageId}`)
                .set('x-messenger-id', buyerId);

        expect(res.statusCode).toEqual(200);
        const message = res.body;
        expect(message.id).not.toBeUndefined();
        expect(message.scope).toEqual('private');
        expect(message.senderId).toEqual(buyerId);
        expect(message.sentDate).not.toBeUndefined();
        expect(message.recipientId).toEqual(buyerId); //sent message to self
        expect(message.deliveredDate).toBeUndefined();
        expect(message.payload).toEqual('Message 123');
      });
    });

    describe('Retrieving and filtering multiple messages', () => {

      beforeAll(async () => {
        // create one 
        let res = await request(buyerURL)
          .post('/api/v1/messages')
          .set('x-messenger-id', buyerId)
          .send({
            recipientId: buyerId,
            payload: `Message Test 1`
          });
        // create another
        res = await request(buyerURL)
          .post('/api/v1/messages')
          .set('x-messenger-id', buyerId)
          .send({
            recipientId: buyerId,
            payload: `Message Test 2`
          });
      });

      test('the returned messages have the expected structure', async () => {
        const res = await request(buyerURL)
          .get(`/api/v1/messages`)
          .set('x-messenger-id', buyerId);

        console.log('Result', res.body);
        expect(res.statusCode).toEqual(200);
        // expect(res.body.length).toBeGreaterThan(0)
        // const message = res.body[0];
        // expect(message).toHaveProperty('id');
        // expect(message).toHaveProperty('id');
        // expect(message).toHaveProperty('id');
        // expect(message).toHaveProperty('id');
        // expect(message).toHaveProperty('id');
      });

    // TODO: Implement these features/tests later

    // when query param 'since' is passed
    // it returns messages sent or received on or after that date

    // when query param 'since' is NOT passed
    // it returns messages sent or received less that 24 hrs old

    // when query param 'partnerId' is passed
    // it returns messages that are both to, and from this partnerId

    });

  });
});
