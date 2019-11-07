const request = require('supertest');
const Config = require('../config');
const buyer_api_port = Config.nodes.node_1.api_port;
const supplier_api_port = Config.nodes.node_2.api_port;

const buyerURL = `http://localhost:${buyer_api_port}`;
const supplierURL = `http://localhost:${supplier_api_port}`;
let buyerId, supplierId;
let rfqId, entanglementId;

describe('Whisper Identities', () => {
  test('should create a new buyer identity: POST /identities', async () => {
    const res = await request(buyerURL)
      .post('/api/v1/identities')
      .send({});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('publicKey');
    buyerId = res.body.publicKey;
  });

  test('should create a new supplier identity: POST /identities', async () => {
    const res = await request(supplierURL)
      .post('/api/v1/identities')
      .send({});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('publicKey');
    supplierId = res.body.publicKey;
  });
});

describe('RFQs', () => {
  test('buyer creates a new RFQ: POST /rfqs', async () => {
    const res = await request(buyerURL)
      .post('/api/v1/rfqs')
      .send({
        sku: 'abc123456',
        quantity: '75',
        deliveryDate: '1572276965272',
        description: 'Widgets',
        supplierId: supplierId
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('sku');
    rfqId = res.body._id;
  });

  test('supplier should have new RFQ: GET /rfqs/:rfqId', async () => {
    // Wait for db to update
    await new Promise((r) => setTimeout(r, 2000));
    let res = await request(supplierURL)
      .get(`/api/v1/rfqs/${rfqId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(rfqId);
  });
});

describe('Buyer Entangles RFQ', () => {
  test('buyer adds Entanglement to RFQ: POST /entanglements', async () => {
    let res = await request(buyerURL)
      .post(`/api/v1/entanglements`)
      .send({
        databaseLocation: {
          collection: 'RFQs',
          objectId: rfqId
        },
        partnerIds: [
          supplierId
        ]
      });
    entanglementId = res.body._id;
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('databaseLocation');
  });

  test('throws error if buyer tries to create second Entanglement for same RFQ: POST /entanglements', async () => {
    // Wait for db to update
    await new Promise((r) => setTimeout(r, 2000));
    let res = await request(buyerURL)
      .post(`/api/v1/entanglements`)
      .send({
        databaseLocation: {
          collection: 'RFQs',
          objectId: rfqId
        },
        partnerIds: [
          supplierId
        ]
      });
    expect(res.statusCode).toEqual(409);
  });

  test('supplier sees Entanglement request: GET /entanglements/:id', async () => {
    let res = await request(supplierURL)
      .get(`/api/v1/entanglements/${entanglementId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(entanglementId);
    expect(res.body.participants[1].messengerId).toEqual(supplierId);
    expect(res.body.participants[1].acceptedRequest).toBe(false);
    expect(res.body.participants[1].isSelf).toBe(true);
    expect(res.body.participants[0].isSelf).toBe(false);
  });

  test('state of buyer Entanglement is "pending": GET /entanglements/:id/state', async () => {
    let res = await request(buyerURL)
      .get(`/api/v1/entanglements/${entanglementId}/state`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('pending');
  });
});


describe('Supplier accepts Entanglement', () => {
  test('supplier accepts Entanglement request: PUT /entanglements/:id', async () => {
    let res = await request(supplierURL)
      .put(`/api/v1/entanglements/${entanglementId}`)
      .send({
        acceptedRequest: true,
        messengerId: supplierId
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(entanglementId);
  });

  test('state of supplier Entanglement is "consistent": GET /entanglements/:id/state', async () => {
    // Wait for db to update
    await new Promise((r) => setTimeout(r, 1000));
    let res = await request(supplierURL)
      .get(`/api/v1/entanglements/${entanglementId}/state`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('consistent');
  });

  test('state of buyer Entanglement is "consistent": GET /entanglements/:id/state', async () => {
    // Wait for db to update
    await new Promise((r) => setTimeout(r, 1000));
    let res = await request(buyerURL)
      .get(`/api/v1/entanglements/${entanglementId}/state`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('consistent');
  });
});

describe('RFQ updates detected', () => {
  test('supplier updates RFQ: PUT /rfqs/:id', async () => {
    let res = await request(buyerURL)
      .put(`/api/v1/rfqs/${rfqId}`)
      .send({
        quantity: '100'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual('100');
  });

  test('state of buyer Entanglement is "inconsistent": GET /entanglements/:id/state', async () => {
    // Wait for db to update
    await new Promise((r) => setTimeout(r, 2000));
    let res = await request(buyerURL)
      .get(`/api/v1/entanglements/${entanglementId}/state`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.state).toEqual('inconsistent');
  });
});
