import request from 'supertest';
import { concatenateThenHash } from '../api/src/utils/crypto/hashes/sha256/sha256';
import { MongoClient } from 'mongodb';

const fs = require('fs');

jest.setTimeout(600000);

// Check <repo-root>/docker-compose.yml for correct URLs
const buyerApiURL = 'http://localhost:8001';
const buyerMessengerURL = 'http://localhost:4001';
const buyerMongoURL = 'mongodb://localhost:27117/radish34'
const supplierMessengerURL = 'http://localhost:4003';
const supplierApiURL = 'http://localhost:8003';

let nativeClient;
let db;

const getConfigFilePath = role => `./config/config-${role}.json`;

const getOrgSettings = role => {
  let settings;
  const filepath = getConfigFilePath(role);
  if (fs.existsSync(filepath)) {
    settings = JSON.parse(fs.readFileSync(filepath));
  }
  expect(settings).toBeTruthy();
  expect(settings.organization).toBeTruthy();
  return settings.organization;
};

beforeAll(async () => {
  // Clear out saved msas so there aren't unintended collisions
  nativeClient = await MongoClient.connect(buyerMongoURL, { useUnifiedTopology: true });
  db = nativeClient.db();
  await db.collection('msas').deleteMany();
  await db.collection('RFP').deleteMany();
});

afterAll(async () => {
  await nativeClient.close();
});

describe('Check that containers are ready', () => {
  describe('Buyer containers', () => {
    test('Buyer messenger GET /health-check returns 200', async () => {
      const res = await request(buyerMessengerURL).get('/api/v1/health-check');
      expect(res.statusCode).toEqual(200);
    });

    test('Buyer radish-api REST server GET /health-check returns 200', async () => {
      const res = await request(buyerApiURL).get('/api/v1/health-check');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Supplier containers', () => {
    test('Supplier messenger GET /health-check returns 200', async () => {
      const res = await request(supplierMessengerURL).get('/api/v1/health-check');
      expect(res.statusCode).toEqual(200);
    });

    test('Supplier radish-api REST server GET /health-check returns 200', async () => {
      const res = await request(supplierApiURL).get('/api/v1/health-check');
      expect(res.statusCode).toEqual(200);
    });
  });

});

let rfpId;

describe('Buyer sends new RFP to supplier', () => {
  let supplierMessengerId;
  let buyerMessengerId;
  const sku = 'FAKE-SKU-123';

  describe('Retrieve identities from messenger', () => {
    test('Supplier messenger GET /identities', async () => {
      const res = await request(supplierMessengerURL).get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      supplierMessengerId = res.body[0].publicKey;
    });

    test('Buyer messenger GET /identities', async () => {
      const res = await request(buyerMessengerURL).get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      buyerMessengerId = res.body[0].publicKey;
    });
  });

  describe('Create new RFP through buyer radish-api', () => {
    test('Buyer graphql mutation createRFP() returns 400 withOUT sku', async () => {
      const postBody = ` mutation {
          createRFP( input: {
            skuDescription: "Widget 200",
            description: "Widget order for SuperWidget",
            proposalDeadline: 1578065104,
            recipients: [ { identity: "${supplierMessengerId}" } ]
          })
          { _id }
        } `
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });
      expect(res.statusCode).toEqual(400);
    });

    test('Buyer graphql mutation createRFP() returns 200', async () => {
      let supplier2 = getOrgSettings('supplier2');

      const postBody = ` mutation {
            createRFP( input: {
              sku: "${sku}",
              skuDescription: "Widget 200",
              description: "Widget order for SuperWidget",
              proposalDeadline: 1578065104,
              recipients: [{
                partner: {
                  identity: "${supplier2.messengerKey}",
                  name: "FakeName",
                  address: "${supplier2.address}",
                  role: "supplier",
                  zkpPublicKey: "${supplier2.zkpPublicKey}",
                }
              }]
            })
            { _id, sku }
          }`
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });
      expect(res.statusCode).toEqual(200);
      console.log(res.body);
      rfpId = res.body.data.createRFP._id;
    });
  });

  describe('Check RFP existence through radish-api queries', () => {
    test('Buyer graphql query rfp() returns 200', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(buyerApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.rfp !== null) {
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.rfp._id).toEqual(rfpId);
      expect(res.body.data.rfp.sku).toEqual(sku);
    });

    test('Supplier graphql query rfp() returns 200', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(supplierApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.rfp !== null) {
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.rfp._id).toEqual(rfpId);
      expect(res.body.data.rfp.sku).toEqual(sku);
    });
  });

  describe('Check RFP contents through radish-api query', () => {
    let messageId;

    test('Buyer rfp.recipients.origination contents are correct', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku, recipients { origination { messageId, receiptDate } } } } `
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: queryBody });
      expect(res.statusCode).toEqual(200);
      console.log(res.body.data.rfp.recipients[0]);
      const origination = res.body.data.rfp.recipients[0].origination;
      expect(origination.receiptDate).not.toBeUndefined();
      messageId = origination.messageId;
      const messageRes = await request(buyerMessengerURL)
        .get(`/api/v1/messages/${messageId}`)
        .set('x-messenger-id', buyerMessengerId);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });

    test('Supplier messenger has raw message that delivered RFP from buyer', async () => {
      const messageRes = await request(supplierMessengerURL)
        .get(`/api/v1/messages/${messageId}`)
        .set('x-messenger-id', supplierMessengerId);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });
  });

});

// create global variables to hold values relating to MSA's for future tests of POs:
let msaId;

describe('Buyer creates MSA, signs it, sends to supplier, supplier responds with signed MSA', () => {
  const supplier = getOrgSettings('supplier2');
  const supplierAddress = supplier.address;
  const supplierAddressPadded = `0x000000000000000000000000${supplierAddress.substring(2)}`;
  const sku = 'FAKE-SKU-123';
  const skuPadded = '0x0000000046414b452d534b552d313233';
  const erc20ContractAddress = '0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d';
  const erc20ContractAddressPadded = '0x000000000000000000000000cd234a471b72ba2f1ccf0a70fcaba648a5eecd8d';
  const tierBounds = [1, 200, 400, 600];
  const tierBoundsPadded = [
    '0x00000000000000000000000000000001',
    '0x000000000000000000000000000000c8',
    '0x00000000000000000000000000000190',
    '0x00000000000000000000000000000258',
  ]
  const pricesByTier = [10, 9, 8];
  const pricesByTierPadded = [
    '0x0000000000000000000000000000000a',
    '0x00000000000000000000000000000009',
    '0x00000000000000000000000000000008',
  ]

  describe('Create new MSA through buyer radish-api', () => {
    test('Buyer graphql mutation createMSA() returns 400 without sku', async () => {
      const postBody = ` mutation {
          createMSA( input: {
            supplierAddress: "${supplierAddress}",
            tierBounds: [1, 200, 400, 600],
            pricesByTier: [10, 9, 8],
            erc20ContractAddress: "${erc20ContractAddress}",
            rfpId: "${rfpId}",
          })
          { _id }
        } `

      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });

      expect(res.statusCode).toEqual(400);
    });

    test('Buyer graphql mutation createMSA() returns 200', async () => {
      const postBody = ` mutation {
        createMSA( input: {
          supplierAddress: "${supplierAddress}",
          tierBounds: [1, 200, 400, 600],
          pricesByTier: [10, 9, 8],
          sku: "${sku}",
          erc20ContractAddress: "${erc20ContractAddress}",
          rfpId: "${rfpId}",
        })
        { zkpPublicKeyOfBuyer, zkpPublicKeyOfSupplier, sku, _id, commitments { commitment, salt } }
      }`

      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });

      const buyerZkpPublicKey = getOrgSettings('buyer').zkpPublicKey;
      const supplierZkpPublicKey = getOrgSettings('supplier2').zkpPublicKey;

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.createMSA.zkpPublicKeyOfBuyer).toEqual(buyerZkpPublicKey);
      expect(res.body.data.createMSA.zkpPublicKeyOfSupplier).toEqual(supplierZkpPublicKey);
      expect(res.body.data.createMSA.sku).toEqual('FAKE-SKU-123');
      expect(res.body.data.createMSA._id).not.toBeNull();
      expect(res.body.data.createMSA.commitments[0].commitment).toEqual(concatenateThenHash(
        buyerZkpPublicKey,
        supplierZkpPublicKey,
        concatenateThenHash(...tierBoundsPadded, ...pricesByTierPadded),
        tierBoundsPadded[0],
        tierBoundsPadded[tierBoundsPadded.length - 1],
        skuPadded,
        erc20ContractAddressPadded,
        '0x00000000000000000000000000000000',
        '0x00000000000000000000000000000000',
        res.body.data.createMSA.commitments[0].salt,
      ));

      // assign global states for PO tests:
      msaId = res.body.data.createMSA._id
    });

    test('After a while, the commitment index should not be null', async () => {
      const queryBody = `{ msa(id:"${msaId}")
                            {
                              _id,
                              commitments {
                                index
                              }
                            }
                          }`
      // Wait for db to update
      console.log('This test can take up to 10 minutes to run. It will provide frequent status updates');
      let res;
      for (let retry = 0; retry < 15; retry++) {
        console.log('Checking for non-null msa index, attempt:', retry);
        res = await request(buyerApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.msa && res.body.data.msa.commitments[0].index !== null) {
          console.log('Test complete');
          break;
        }
        await new Promise((r) => setTimeout(r, 20000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.msa._id).not.toBeUndefined();
      expect(res.body.data.msa.index).not.toBeNull();
    });
  });
});

describe('Buyer creates PO', () => {
  describe('Create new PO through buyer radish-api', () => {
    test('Buyer graphql mutation createPO() returns 400 without volume', async () => {
      const postBody = ` mutation {
          createPO( input: {
            msaId: "${msaId}",
            description: "300 units",
            deliveryDate: 1584051780,
          })
          { _id }
        } `

      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });

      expect(res.statusCode).toEqual(400);
    });

    test('Buyer graphql mutation createPO() returns 200', async () => {
      const postBody = ` mutation {
        createPO( input: {
          msaId: "${msaId}",
          description: "300 units",
          deliveryDate: 1584051780,
          volume: 300
        })
        { _id, constants { zkpPublicKeyOfBuyer, zkpPublicKeyOfSupplier, sku }, commitments { commitment, salt } }
      } `

      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.createPO.constants.zkpPublicKeyOfBuyer).toEqual(getOrgSettings('buyer').zkpPublicKey);
      expect(res.body.data.createPO.constants.zkpPublicKeyOfSupplier).toEqual(getOrgSettings('supplier2').zkpPublicKey);
      expect(res.body.data.createPO.constants.sku).toEqual('FAKE-SKU-123');
      expect(res.body.data.createPO._id).not.toBeNull();
      expect(res.body.data.createPO.commitments[0]).not.toEqual(null);
    });
  });
});
