const request = require('supertest');
const Config = require('../config');
const buyer_api_port = Config.nodes.node_1.api_port;
const supplier_api_port = Config.nodes.node_2.api_port;

const buyerURL = `http://localhost:${buyer_api_port}`;
const supplierURL = `http://localhost:${supplier_api_port}`;
let buyerId, supplierId;
let rfpId, entanglementId;

describe('Whisper Identities', () => {
  let identityCount;
  test('should retrieve all buyer identities: GET /identities', async () => {
    const res = await request(buyerURL)
      .get('/api/v1/identities');
    expect(res.statusCode).toEqual(200);
    identityCount = res.body.length;
  });

  test('should create a new buyer identity: POST /identities', async () => {
    const res = await request(buyerURL)
      .post('/api/v1/identities')
      .send({});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('publicKey');
    buyerId = res.body.publicKey;
  });

  test('number of buyer identities should have incremented: GET /identities', async () => {
    const res = await request(buyerURL)
      .get('/api/v1/identities');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(identityCount + 1);
  });
});

describe('Messages', () => {
  let messageId;
  test('buyer sends message to self', async () => {
    const res = await request(buyerURL)
      .post('/api/v1/messages')
      .set('x-messenger-id', buyerId)
      .send({
        recipientId: buyerId,
        message: 'Message 1'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.payload).toEqual('Message 1');
    messageId = res.body._id;
  });

  test('buyer retrieves message to self', async () => {
    const res = await request(buyerURL)
      .get(`/api/v1/messages/${messageId}`)
      .set('x-messenger-id', buyerId);
    expect(res.statusCode).toEqual(200);
    expect(res.body.payload).toEqual('Message 1');
  });

  //   test('supplier should have new RFP: GET /rfps/:rfpId', async () => {
  //     // Wait for db to update
  //     await new Promise((r) => setTimeout(r, 2000));
  //     let res = await request(supplierURL)
  //       .get(`/api/v1/rfps/${rfpId}`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.uuid).toEqual(rfpId);
  //   });
  // });

  // describe('Buyer Entangles RFP', () => {
  //   test('buyer adds Entanglement to RFP: POST /entanglements', async () => {
  //     let res = await request(buyerURL)
  //       .post(`/api/v1/entanglements`)
  //       .send({
  //         databaseLocation: {
  //           collection: 'RFPs',
  //           objectId: rfpId
  //         },
  //         partnerIds: [
  //           supplierId
  //         ]
  //       });
  //     entanglementId = res.body._id;
  //     expect(res.statusCode).toEqual(201);
  //     expect(res.body).toHaveProperty('databaseLocation');
  //   });

  //   test('throws error if buyer tries to create second Entanglement for same RFP: POST /entanglements', async () => {
  //     // Wait for db to update
  //     await new Promise((r) => setTimeout(r, 2000));
  //     let res = await request(buyerURL)
  //       .post(`/api/v1/entanglements`)
  //       .send({
  //         databaseLocation: {
  //           collection: 'RFPs',
  //           objectId: rfpId
  //         },
  //         partnerIds: [
  //           supplierId
  //         ]
  //       });
  //     expect(res.statusCode).toEqual(409);
  //   });

  //   test('supplier sees Entanglement request: GET /entanglements/:id', async () => {
  //     let res = await request(supplierURL)
  //       .get(`/api/v1/entanglements/${entanglementId}`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body._id).toEqual(entanglementId);
  //     expect(res.body.participants[1].messengerId).toEqual(supplierId);
  //     expect(res.body.participants[1].acceptedRequest).toBe(false);
  //     expect(res.body.participants[1].isSelf).toBe(true);
  //     expect(res.body.participants[0].isSelf).toBe(false);
  //   });

  //   test('state of buyer Entanglement is "pending": GET /entanglements/:id/state', async () => {
  //     let res = await request(buyerURL)
  //       .get(`/api/v1/entanglements/${entanglementId}/state`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.state).toEqual('pending');
  //   });
  // });


  // describe('Supplier accepts Entanglement', () => {
  //   test('supplier accepts Entanglement request: PUT /entanglements/:id', async () => {
  //     let res = await request(supplierURL)
  //       .put(`/api/v1/entanglements/${entanglementId}`)
  //       .send({
  //         acceptedRequest: true,
  //         messengerId: supplierId
  //       });
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body._id).toEqual(entanglementId);
  //   });

  //   test('state of supplier Entanglement is "consistent": GET /entanglements/:id/state', async () => {
  //     // Wait for db to update
  //     await new Promise((r) => setTimeout(r, 1000));
  //     let res = await request(supplierURL)
  //       .get(`/api/v1/entanglements/${entanglementId}/state`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.state).toEqual('consistent');
  //   });

  //   test('state of buyer Entanglement is "consistent": GET /entanglements/:id/state', async () => {
  //     // Wait for db to update
  //     await new Promise((r) => setTimeout(r, 1000));
  //     let res = await request(buyerURL)
  //       .get(`/api/v1/entanglements/${entanglementId}/state`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.state).toEqual('consistent');
  //   });
  // });

  // describe('RFP updates detected', () => {
  //   test('supplier updates RFP: PUT /rfps/:id', async () => {
  //     let res = await request(supplierURL)
  //       .put(`/api/v1/rfps/${rfpId}`)
  //       .send({
  //         estimatedQty: {
  //           quantity: '100',
  //           unit: 'piece'
  //         }
  //       });
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.estimatedQty.quantity).toEqual('100');
  //   });

  //   test('state of buyer Entanglement is "inconsistent": GET /entanglements/:id/state', async () => {
  //     // Wait for db to update
  //     await new Promise((r) => setTimeout(r, 2000));
  //     let res = await request(buyerURL)
  //       .get(`/api/v1/entanglements/${entanglementId}/state`);
  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body.state).toEqual('inconsistent');
  //   });
});
