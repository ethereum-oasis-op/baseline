const request = require('supertest');
const Config = require('../config');
const mongoose = require('mongoose');
const Identity = require('../src/models/Identity.js')

const { setupDB } = require('./test-setup');

const buyerURL = `http://localhost:4001`;
let buyerId;

describe('/identities', () => {
  let identityCount;
  // Setup a Test Database
  setupDB('mongodb://localhost:27017/radish34_test');


  // GET
    // when no identities exist
    // it should return []
    
    // when one or more identities exist
    // it should return the identity in an array
    // - the identity should be structured json
    // - it should at least have the following fields: { publicKey, createdDate }
 
  // POST

    // it creates a new identity
    // - returns a new ID fields { publicKey, createdDate }

  describe('No identities exist', () => {
    beforeEach(async () => {
      await Identity.deleteMany(); 
    });

    test('GET /identities returns an empty array', async () => {
      const res = await request(buyerURL)
        .get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
      expect(res.body.length).toEqual(0);
    });
   
    afterEach(async () => {
      await Identity.deleteMany() 
    });
});

//   test('GET /identities returns an identity', async () => {
//     const res = await request(buyerURL)
//       .get('/api/v1/identities');
//     expect(res.statusCode).toEqual(200);
//     identityCount = res.body.length;
//   });

//   test('POST /identities to create a new one', async () => {
//     const res = await request(buyerURL)
//       .post('/api/v1/identities')
//       .send({});
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toHaveProperty('publicKey');
//     buyerId = res.body.publicKey;
//   });

//   test('number of buyer identities should have incremented: GET /identities', async () => {
//     const res = await request(buyerURL)
//       .get('/api/v1/identities');
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.length).toEqual(identityCount + 1);
//   });
});

// describe('/messages', () => {
//   let messageId;
  
//   // When no Identity is passed in header
//   // it should return a 400 
//   // it should have a error message that says ""'X-messenger-id' header is required"

//   // When there is an messenger-id header

//   // GET /messages
//   // When there are no messages
//   // it should return an empty array []

//   // When there are one or more messages
//   // it returns non-empty array of messages

//   // describe: filter params

//   // when query param 'since' is passed
//   // it returns messages sent or received on or after that date

//   // when query param 'since' is NOT passed
//   // it returns messages sent or received less that 24 hrs old

//   // when query param 'partnerId' is passed
//   // it returns messages that are both to, and from this partnerId

//   // GET /messages/:messagesId

//   // when a message exists with the requested ID
//   // it returns a json object
//   // the returned message has the following fields: {id, scope, senderId, sentDate, recipientId, deliveredDate, payload} 

//   // when the message does not exist
//   // it returns a 404

//   // POST

//   // when the post body has the required fields
//   // the required fields are { recipientID, and payload }
//   // it returns the new message object
//   // the returned message has the following fields: {id, scope, senderId, sentDate, recipientId, deliveredDate, payload} 

//   // when the post body does not have the required fields
//   // it returns a 400 error
//   // it has an error message that lists the required fields


//   test('buyer sends message to self', async () => {
//     const res = await request(buyerURL)
//       .post('/api/v1/messages')
//       .set('x-messenger-id', buyerId)
//       .send({
//         recipientId: buyerId,
//         message: 'Message 1'
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body.payload).toEqual('Message 1');
//     messageId = res.body._id;
//   });

//   test('buyer retrieves message to self', async () => {
//     const res = await request(buyerURL)
//       .get(`/api/v1/messages/${messageId}`)
//       .set('x-messenger-id', buyerId);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.payload).toEqual('Message 1');
//   });

// });
