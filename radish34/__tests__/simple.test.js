import request from 'supertest';
import { concatenateThenHash } from '../api/src/utils/crypto/hashes/sha256/sha256';
import { MongoClient } from 'mongodb';

const fs = require('fs');

jest.setTimeout(600000);

// Check <repo-root>/docker-compose.yml for correct URLs
const senderApiURL = 'http://localhost:8001';
const senderMessengerURL = 'http://localhost:4001';
const senderMongoURL = 'mongodb://localhost:27117/radish34'
const recipientMessengerURL = 'http://localhost:4003';
const recipientApiURL = 'http://localhost:8003';

let nativeClient;
let db;
let agreementId;

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
  nativeClient = await MongoClient.connect(senderMongoURL, { useUnifiedTopology: true });
  db = nativeClient.db();
  await db.collection('agreements').deleteMany();
});

afterAll(async () => {
  await nativeClient.close();
});

describe('Check that containers are ready', () => {
    describe('Sender containers', () => {
      test('Sender messenger GET /health returns 200', async () => {
        const res = await request(senderMessengerURL).get('/api/v1/health');
        expect(res.statusCode).toEqual(200);
      });
  
      test('Sender radish-api REST server GET /health returns 200', async () => {
        const res = await request(senderApiURL).get('/health');
        expect(res.statusCode).toEqual(200);
      });
    });
  
    describe('Recipient containers', () => {
      test('Recipient messenger GET /health returns 200', async () => {
        const res = await request(recipientMessengerURL).get('/api/v1/health');
        expect(res.statusCode).toEqual(200);
      });
  
      test('Recipient radish-api REST server GET /health returns 200', async () => {
        const res = await request(recipientApiURL).get('/health');
        expect(res.statusCode).toEqual(200);
      });
    });
  
  });

describe('Sender creates Agreement, signs it, sends to recipient, recipient responds with signed Agreement', () => {
    const recipient = getOrgSettings('supplier1');
    const recipientAddress = recipient.address;
    const recipientAddressPadded = `0x000000000000000000000000${recipientAddress.substring(2)}`;
    const name = `CO-${ Math.floor(1000 + Math.random() * 10000)}`;
    const prevId = `CO-${ Math.floor(1000 + Math.random() * 10000)}`;
    const namePadded = '0x000000000000000000434f2d31323334';
    const erc20ContractAddress = '0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d';
    const erc20ContractAddressPadded = '0x000000000000000000000000cd234a471b72ba2f1ccf0a70fcaba648a5eecd8d';
    const description = 'CO Services';
    const descriptionPadded = '0x0000000000434f205365727669636573';
    describe('Create new Agreement through buyer radish-api', () => {
      test('Sender graphql mutation createAgreement() returns 400 without name', async () => {
        const postBody = ` mutation {
            createAgreement( input: {
              recipientAddress: "${recipientAddress}",
              description: "${description}",
              erc20ContractAddress: "${erc20ContractAddress}",
              prevId: "${prevId}",
            })
            { _id }
          } `
  
        const res = await request(senderApiURL)
          .post('/graphql')
          .send({ query: postBody });
  
        expect(res.statusCode).toEqual(400);
      });
  
      test('Sender graphql mutation createAgreement() returns 200', async () => {
        const postBody = ` mutation {
          createAgreement( input: {
            recipientAddress: "${recipientAddress}",
            name: "${name}",
            description: "${description}",
            erc20ContractAddress: "${erc20ContractAddress}",
            prevId: "${prevId}",
          })
          { zkpPublicKeyOfSender, zkpPublicKeyOfRecipient, name, _id, commitments { commitment, salt } }
        }`
  
        const res = await request(senderApiURL)
          .post('/graphql')
          .send({ query: postBody });
  
        const senderZkpPublicKey = getOrgSettings('buyer').zkpPublicKey;
        const recipientZkpPublicKey = getOrgSettings('supplier1').zkpPublicKey;
  
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.createAgreement.zkpPublicKeyOfSender).toEqual(senderZkpPublicKey);
        expect(res.body.data.createAgreement.zkpPublicKeyOfRecipient).toEqual(recipientZkpPublicKey);
        expect(res.body.data.createAgreement.name).toEqual(name);
        expect(res.body.data.createAgreement._id).not.toBeNull();
        /* expect(res.body.data.createAgreement.commitments[0].commitment).toEqual(concatenateThenHash(
          senderZkpPublicKey,
          recipientZkpPublicKey,
          namePadded,
          descriptionPadded,
          erc20ContractAddressPadded,
          res.body.data.createAgreement.commitments[0].salt,
        )); */
  
        agreementId = res.body.data.createAgreement._id
      });
  
      test('After a while, the commitment index should not be null', async () => {
        const queryBody = `{ agreement(id:"${agreementId}")
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
          res = await request(senderApiURL)
            .post('/graphql')
            .send({ query: queryBody });
          if (res.body.data.agreement && res.body.data.agreement.commitments[0].index !== null) {
            console.log('Test complete');
            break;
          }
          await new Promise((r) => setTimeout(r, 20000));
        }
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.agreement._id).not.toBeUndefined();
        expect(res.body.data.agreement.commitments[0].index).not.toBeNull();
      });
    });
  });