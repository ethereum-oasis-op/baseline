import request from 'supertest';
import { concatenateThenHash } from '../api/src/utils/crypto/hashes/sha256/sha256';
import { MongoClient } from 'mongodb';

const fs = require('fs');

const getConfigFilePath = role => `./config/config-${role}.json`;

const getOrgSettings = role => {
  let settings;
  const filepath = getConfigFilePath(role);
  if (fs.existsSync(filepath)) {
    settings = JSON.parse(fs.readFileSync(filepath));
  }
  return settings.organization;
};

// Check <repo-root>/docker-compose.yml for correct URLs
const buyerApiURL = 'http://localhost:8001';
const buyerMessengerURL = 'http://localhost:4001';
const buyerMongoURL = 'mongodb://localhost:27117/radish34'
const supplier1MessengerURL = 'http://localhost:4002';
const supplier1ApiURL = 'http://localhost:8002';
const supplier2MessengerURL = 'http://localhost:4003';
const supplier2ApiURL = 'http://localhost:8003';

let nativeClient;
let db;

// create global variables to hold values for future tests
let buyer = getOrgSettings('buyer');
let supplier1 = getOrgSettings('supplier1');
let supplier2 = getOrgSettings('supplier2');
let rfpId;
let proposalId;
let msaId;

jest.setTimeout(600000);

beforeAll(async () => {
  // Clear out saved documents so there aren't unintended collisions
  nativeClient = await MongoClient.connect(buyerMongoURL, { useUnifiedTopology: true });
  db = nativeClient.db();
  await db.collection('RFPs').deleteMany();
  await db.collection('msas').deleteMany();
  await db.collection('pos').deleteMany();
  await db.collection('proposals').deleteMany();
});

afterAll(async () => {
  await nativeClient.close();
});

describe('Get organization settings from config files', () => {

  test('Buyer config retrieved', async () => {
    expect(buyer).toBeTruthy();
  });

  test('Supplier1 config retrieved', async () => {
    expect(supplier1).toBeTruthy();
  });

  test('Supplier2 config retrieved', async () => {
    expect(supplier2).toBeTruthy();
  });

});

describe('Check that containers are ready', () => {
  describe('Buyer containers', () => {
    test('Buyer messenger GET /health returns 200', async () => {
      const res = await request(buyerMessengerURL).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
    });

    test('Buyer radish-api REST server GET /health returns 200', async () => {
      const res = await request(buyerApiURL).get('/health');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Supplier1 containers', () => {
    test('Supplier1 messenger GET /health returns 200', async () => {
      const res = await request(supplier1MessengerURL).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
    });

    test('Supplier1 radish-api REST server GET /health returns 200', async () => {
      const res = await request(supplier1ApiURL).get('/health');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('Supplier2 containers', () => {
    test('Supplier2 messenger GET /health returns 200', async () => {
      const res = await request(supplier2MessengerURL).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
    });

    test('Supplier2 radish-api REST server GET /health returns 200', async () => {
      const res = await request(supplier2ApiURL).get('/health');
      expect(res.statusCode).toEqual(200);
    });
  });

});

describe('Buyer sends new RFP to both suppliers', () => {
  const sku = 'FAKE-SKU-123';

  describe('Retrieve identities from messenger', () => {
    test('Buyer messenger GET /identities', async () => {
      const res = await request(buyerMessengerURL).get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(buyer.messengerKey).toEqual(res.body[0].publicKey);
    });

    test('Supplier2 messenger GET /identities', async () => {
      const res = await request(supplier2MessengerURL).get('/api/v1/identities');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(supplier2.messengerKey).toEqual(res.body[0].publicKey);
    });

  });

  describe('Create new RFP through buyer radish-api', () => {
    test('Buyer graphql mutation createRFP() returns 400 withOUT sku', async () => {
      const postBody = ` mutation {
          createRFP( input: {
            skuDescription: "Widget 200",
            description: "Widget order for SuperWidget",
            proposalDeadline: 1578065104,
            recipients: [
              {
                partner: {
                  identity: "${supplier1.messengerKey}",
                  name: "Supplier 1",
                  address: "${supplier1.address}",
                  role: "supplier",
                  zkpPublicKey: "${supplier1.zkpPublicKey}",
                }
              },
              {
                partner: {
                  identity: "${supplier2.messengerKey}",
                  name: "Supplier 2",
                  address: "${supplier2.address}",
                  role: "supplier",
                  zkpPublicKey: "${supplier2.zkpPublicKey}",
                }
              }
            ]
          })
          { _id }
        } `
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });
      expect(res.statusCode).toEqual(400);
    });

    test('Buyer graphql mutation createRFP() returns 200', async () => {
      const postBody = ` mutation {
            createRFP( input: {
              sku: "${sku}",
              skuDescription: "Widget 200",
              description: "Widget order for SuperWidget",
              proposalDeadline: 1578065104,
              recipients: [
                {
                  partner: {
                    identity: "${supplier1.messengerKey}",
                    name: "Supplier 1",
                    address: "${supplier1.address}",
                    role: "supplier",
                    zkpPublicKey: "${supplier1.zkpPublicKey}",
                  }
                },
                {
                  partner: {
                    identity: "${supplier2.messengerKey}",
                    name: "Supplier 2",
                    address: "${supplier2.address}",
                    role: "supplier",
                    zkpPublicKey: "${supplier2.zkpPublicKey}",
                  }
                }
              ]
            })
            { _id, sku }
          }`
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: postBody });
      expect(res.statusCode).toEqual(200);
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

    test('Supplier1 graphql query rfp() returns 200', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(supplier1ApiURL)
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

    test('Supplier2 graphql query rfp() returns 200', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(supplier2ApiURL)
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

  describe('Check that RFP creation messages exists in messenger databases', () => {
    let messageId1;
    let messageId2;

    test('Buyer messenger has raw message that delivered RFP to supplier1', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku, recipients { origination { messageId, receiptDate } } } } `
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: queryBody });
      expect(res.statusCode).toEqual(200);
      const origination = res.body.data.rfp.recipients[0].origination;
      expect(origination.receiptDate).not.toBeUndefined();
      messageId1 = origination.messageId;
      const messageRes = await request(buyerMessengerURL)
        .get(`/api/v1/messages/${messageId1}`)
        .set('x-messenger-id', buyer.messengerKey);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });

    test('Buyer messenger has raw message that delivered RFP to supplier2', async () => {
      const queryBody = `{ rfp(uuid: "${rfpId}") { _id, sku, recipients { origination { messageId, receiptDate } } } } `
      const res = await request(buyerApiURL)
        .post('/graphql')
        .send({ query: queryBody });
      expect(res.statusCode).toEqual(200);
      const origination = res.body.data.rfp.recipients[1].origination;
      expect(origination.receiptDate).not.toBeUndefined();
      messageId2 = origination.messageId;
      const messageRes = await request(buyerMessengerURL)
        .get(`/api/v1/messages/${messageId2}`)
        .set('x-messenger-id', buyer.messengerKey);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });

    test('Supplier1 messenger has raw message that delivered RFP from buyer', async () => {
      const messageRes = await request(supplier1MessengerURL)
        .get(`/api/v1/messages/${messageId1}`)
        .set('x-messenger-id', supplier1.messengerKey);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });

    test('Supplier2 messenger has raw message that delivered RFP from buyer', async () => {
      const messageRes = await request(supplier2MessengerURL)
        .get(`/api/v1/messages/${messageId2}`)
        .set('x-messenger-id', supplier2.messengerKey);
      expect(messageRes.statusCode).toEqual(200);
      const payload = JSON.parse(messageRes.body.payload)
      expect(payload.uuid).toEqual(rfpId);
    });
  });
});

describe('Supplier2 sends new Proposal to buyer', () => {
  describe('Create new Proposal through supplier2 radish-api', () => {
    test('Supplier2 graphql mutation createProposal() returns 200', async () => {
      const postBody = ` mutation {
          createProposal( input: {
            rfpId: "${rfpId}",
            rates: [
              {
                startRange: 0,
                endRange: 100,
                price: 10.0,
                unitOfMeasure: "Price Per Unit"
              },
              {
                startRange: 101,
                endRange: 200
                price: 9.0,
                unitOfMeasure: "Price Per Unit"
              },
              {
                startRange: 201,
                endRange: 300
                price: 8.0,
                unitOfMeasure: "Price Per Unit"
              }
            ],
            erc20ContractAddress: "0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d",
            recipient: "${buyer.messengerKey}"
          })
          { _id, rfpId, rates { startRange, endRange, price, unitOfMeasure}, sender }
        } `

      const res = await request(supplier2ApiURL)
        .post('/graphql')
        .send({ query: postBody });

      expect(res.statusCode).toEqual(200);
      proposalId = res.body.data.createProposal._id;
    });
  });

  describe('Check Proposal existence through radish-api queries', () => {
    test('Supplier2 graphql query proposal() returns 200', async () => {
      const queryBody = `{ proposal(id: "${proposalId}") { _id, rfpId } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(supplier2ApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.proposal !== null) {
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.proposal._id).toEqual(proposalId);
      expect(res.body.data.proposal.rfpId).toEqual(rfpId);
    });

    test('Buyer graphql query proposal() returns 200', async () => {
      const queryBody = `{ proposal(id: "${proposalId}") { _id, rfpId } } `
      // Wait for db to update
      let res;
      for (let retry = 0; retry < 10; retry++) {
        res = await request(buyerApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.proposal !== null) {
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.proposal._id).toEqual(proposalId);
      expect(res.body.data.proposal.rfpId).toEqual(rfpId);
    });
  });
});

describe('Buyer creates MSA, signs it, sends to Supplier2, Supplier2 responds with signed MSA', () => {
  const supplierAddressPadded = `0x000000000000000000000000${supplier2.address.substring(2)}`;
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

  describe('Buyer creates new MSA for Supplier2 through radish-api', () => {
    test('Buyer graphql mutation createMSA() returns 400 without sku', async () => {
      const postBody = ` mutation {
          createMSA( input: {
            supplierAddress: "${supplier2.address}",
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
          supplierAddress: "${supplier2.address}",
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

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.createMSA.zkpPublicKeyOfBuyer).toEqual(buyer.zkpPublicKey);
      expect(res.body.data.createMSA.zkpPublicKeyOfSupplier).toEqual(supplier2.zkpPublicKey);
      expect(res.body.data.createMSA.sku).toEqual('FAKE-SKU-123');
      expect(res.body.data.createMSA._id).not.toBeNull();
      expect(res.body.data.createMSA.commitments[0].commitment).toEqual(concatenateThenHash(
        buyer.zkpPublicKey,
        supplier2.zkpPublicKey,
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
      console.log('Waiting for new MSA commitment in Shield contract. This can take up to 5 minutes...');
      let res;
      for (let retry = 0; retry < 15; retry++) {
        console.log('Checking for non-null MSA index, attempt:', retry);
        res = await request(buyerApiURL)
          .post('/graphql')
          .send({ query: queryBody });
        if (res.body.data.msa && res.body.data.msa.commitments[0].index !== null) {
          console.log('...MSA commitment test complete.');
          break;
        }
        await new Promise((r) => setTimeout(r, 20000));
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.msa._id).not.toBeUndefined();
      expect(res.body.data.msa.commitments[0].index).not.toBeNull();
    });
  });
});

describe('Buyer creates PO for Supplier2 based on MSA', () => {
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
      console.log('Buyer creating new PO for Supplier2. This test takes a few minutes...');
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
      expect(res.body.data.createPO.constants.zkpPublicKeyOfBuyer).toEqual(buyer.zkpPublicKey);
      expect(res.body.data.createPO.constants.zkpPublicKeyOfSupplier).toEqual(supplier2.zkpPublicKey);
      expect(res.body.data.createPO.constants.sku).toEqual('FAKE-SKU-123');
      expect(res.body.data.createPO._id).not.toBeNull();
      expect(res.body.data.createPO.commitments[0]).not.toEqual(null);
    });
  });
});
