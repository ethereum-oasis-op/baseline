const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const commitMgrApi = request('localhost:4001');
const workflowMgrApi = request('localhost:5001');
const keyMgrApi = request('localhost:8091');
const zkpMgrApi = request('localhost:8080');

jest.setTimeout(35000);

beforeAll(async () => {
  // Clear out mongo before tests to ensure no overlap with contract addresses
  const config = {
    mongo: {
      debug: 'true',
      bufferMaxEntries: 8,
      firstConnectRetryDelaySecs: 5
    },
    mongoose: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      poolSize: 5, // Max. number of simultaneous connections to maintain
      socketTimeoutMS: 0, // Use os-default, only useful when a network issue occurs and the peer becomes unavailable
      keepAlive: true // KEEP ALIVE!
    }
  };

  const dbUrl =
    'mongodb://' +
    `${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@` +
    `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;

  await mongoose.connect(dbUrl, config.mongoose);
  const collections = (await mongoose.connection.db.listCollections().toArray()).map(
    (collection) => collection.name
  );
  if (collections.indexOf('merkle-trees') !== -1) {
    await mongoose.connection.db.dropCollection('merkle-trees');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

/************************************************
 * Sequence of requests to create a new workflow,
 * then add a commit to that workflow
 *
 * POST /zk-snarks/accounts
 * POST /workflows?type=signature
 * GET /workflows/:workflowId
 * POST /commits
 * POST /commits/:commitId/generate-proof
 * GET /commits/:commitId
 * POST /commits/:commitId/send-on-chain
 * GET /commits/:commitId
 ************************************************/

describe('Initialization', () => {
  test('commit-mgr GET /status returns 200', async () => {
    const res = await commitMgrApi.get('/status');
    expect(res.statusCode).toEqual(200);
  });

  test('workflow-mgr GET /status returns 200', async () => {
    const res = await workflowMgrApi.get('/status');
    expect(res.statusCode).toEqual(200);
  });

  test('key-mgr GET /status returns 200', async () => {
    const res = await keyMgrApi.get('/status');
    expect(res.statusCode).toEqual(200);
  });

  test('zkp-mgr GET /status returns 200', async () => {
    const res = await zkpMgrApi.get('/status');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Create new workflow', () => {
  let eddsaPublicKey;
  let workflowId;
  let zkCircuitId;
  let commitId;

  test('[key-mgr] POST /zk-snarks/accounts', async () => {
    const res = await keyMgrApi.post('/zk-snarks/accounts').send({});
    expect(res.statusCode).toEqual(200);
    expect(res.body.curve).toEqual('bn254');
    expect(res.body.signingAlgorithm).toEqual('eddsa');

    eddsaPublicKey = res.body.publicKey;
    expect(eddsaPublicKey).toMatch(new RegExp('^0x[a-fA-F0-9]*'));
  });

  test('[workflow-mgr] POST /workflows?type=signature', async () => {
    const res = await workflowMgrApi.post('/workflows?type=signature').send({
      description: 'signature test',
      clientType: 'test client',
      chainId: '101010',
      identities: [eddsaPublicKey]
    });
    expect(res.statusCode).toEqual(201);

    workflowId = res.body.workflowId;
    expect(workflowId).not.toBeUndefined();
  });

  test('[workflow-mgr] GET /workflows/:workflowId', async () => {
    // Poll workflow until the setup process is complete
    const res = await workflowMgrApi.get(`/workflows/${workflowId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success-track-shield');
    zkCircuitId = res.body.zkCircuitId;
    expect(zkCircuitId).not.toBeUndefined();
  });

  test('[commit-mgr] POST /commits', async () => {
    const res = await commitMgrApi.post('/commits').send({
      workflowId: workflowId,
      rawData: {
        objectType: 'invoice',
        monetaryValue: 10000,
        currencyUnits: 'USD',
        buyerId: '123',
        supplierId: '345',
        paymentDueDate: 20211201
      },
      participants: [],
      eddsaKey: eddsaPublicKey
    });
    expect(res.statusCode).toEqual(201);
    commitId = res.body._id;
    expect(commitId).not.toBeUndefined();
  });

  test('[commit-mgr] POST /commits/:commitId/generate-proof', async () => {
    const res = await commitMgrApi.post(`/commits/${commitId}/generate-proof`);
    expect(res.statusCode).toEqual(200);
  });

  test('[commit-mgr] GET /commits/:commitId', async () => {
    const res = await commitMgrApi.get(`/commits/${commitId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.workflowId).toEqual(workflowId);
    expect(res.body.zkCircuitId).toEqual(zkCircuitId);
  });

  test('[commit-mgr] POST /commits/:commitId/send-on-chain', async () => {
    const res = await commitMgrApi.post(`/commits/${commitId}/send-on-chain`);
    expect(res.statusCode).toEqual(200);
  });

  test('[commit-mgr] GET /commits/:commitId', async () => {
    const res = await commitMgrApi.get(`/commits/${commitId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success-arrive-on-chain');
  });
});
