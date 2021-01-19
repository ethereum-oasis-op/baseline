const request = require("supertest");
const { ethers } = require("ethers");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const { web3provider, wallet, txManager, waitRelayTx, deposit, getBalance } = require("./utils.js");
const shieldContract = require("../../contracts/artifacts/Shield.json");
const verifierContract = require("../../contracts/artifacts/VerifierNoop.json");

const apiRequest = request("localhost:4001");
const treeHeight = 2;

let accounts;
let shieldAddress;
let counterpartyShieldAddress;
let verifierAddress;

jest.setTimeout(35000);

beforeAll(async () => {
  // Clear out mongo before tests to ensure no overlap with contract addresses
  const config = {
    mongo: {
      debug: 'true',
      bufferMaxEntries: 8,
      firstConnectRetryDelaySecs: 5,
    },
    mongoose: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      poolSize: 5, // Max. number of simultaneous connections to maintain
      socketTimeoutMS: 0, // Use os-default, only useful when a network issue occurs and the peer becomes unavailable
      keepAlive: true, // KEEP ALIVE!
    }
  };

  const dbUrl = 'mongodb://' +
    `${process.env.DATABASE_USER}` + ':' +
    `${process.env.DATABASE_PASSWORD}` + '@' +
    `${process.env.DATABASE_HOST}` + '/' +
    `${process.env.DATABASE_NAME}`;

  await mongoose.connect(dbUrl, config.mongoose);
  await mongoose.connection.db.dropCollection('merkle-trees');

  //const waitTx = web3provider.bind(this, waitRelayTx);
  if (txManager === 'infura-gas') {
    const balance = await getBalance();
    console.log('ITX balance:', balance);
    if (balance < 1) {
      const res = await deposit();
      console.log('deposit res:', res);
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Initialization", () => {

  test("commit-mgr GET /status returns 200", async () => {
    const res = await apiRequest.get("/status");
    expect(res.statusCode).toEqual(200);
  });

});

describe("Check eth_ jsonrpc methods relayed to web3 provider", () => {

  test("eth_accounts retrieves accounts from eth client", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_accounts",
      params: [],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    accounts = res.body.result;
    accounts = [process.env.WALLET_PUBLIC_KEY]; // TODO: hack
    expect(accounts).not.toBeUndefined();
    expect(accounts.length).toBeGreaterThan(0);
  });

  test("eth_getBalance retrieves accounts[0] balance", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [
        accounts[0],
        "latest"
      ],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toBeUndefined();
    expect(res.body.result).not.toBeUndefined();
    if (txManager === 'besu') {
      expect(parseInt(Number(res.body.result), 10)).toBeGreaterThan(0);
    }
  });

});

describe("Deploy contracts", () => {
  let txHash;

  test("Deploy VerifierNoop.sol contract: eth_sendRawTransaction", async () => {
    const sender = accounts[0];
    const nonce = await wallet.getTransactionCount();
    const unsignedTx = {
      from: sender,
      data: verifierContract.bytecode,
      nonce
    };

    const gasEstimate = await wallet.estimateGas(unsignedTx);
    unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

    const tx = await wallet.sendTransaction(unsignedTx);
    await tx.wait();
    txHash = tx.hash;

    expect(txHash).not.toBeUndefined();
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("Retrieve VerifierNoop.sol tx receipt", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
    });
    const txDetails = res.body.result;
    verifierAddress = txDetails.contractAddress;
    expect(verifierAddress).not.toBeUndefined();
    expect(verifierAddress).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("Deploy Shield.sol contract: eth_sendRawTransaction", async () => {
    const sender = accounts[0];
    const nonce = await wallet.getTransactionCount();
    const abiCoder = new ethers.utils.AbiCoder();
    // Encode the constructor parameters, then append to bytecode
    const encodedParams = abiCoder.encode(["address", "uint"], [verifierAddress, treeHeight]);
    const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();
    const unsignedTx = {
      from: sender,
      data: bytecodeWithParams,
      nonce
    };

    const gasEstimate = await wallet.estimateGas(unsignedTx);
    unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

    const tx = await wallet.sendTransaction(unsignedTx);
    await tx.wait();
    txHash = tx.hash;

    expect(txHash).not.toBeUndefined();
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("Retrieve Shield.sol tx receipt", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
    });
    const txDetails = res.body.result;
    shieldAddress = txDetails.contractAddress;
    expect(shieldAddress).not.toBeUndefined();
    expect(shieldAddress).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

});

describe("Check that old logs are scanned when baseline_track is called", () => {

  test("Deploy Shield.sol contract: eth_sendRawTransaction", async () => {
    const sender = accounts[0];
    const nonce = await wallet.getTransactionCount();
    const abiCoder = new ethers.utils.AbiCoder();
    // Encode the constructor parameters, then append to bytecode
    const encodedParams = abiCoder.encode(["address", "uint"], [verifierAddress, treeHeight]);
    const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();
    const unsignedTx = {
      from: sender,
      data: bytecodeWithParams,
      nonce
    };

    const gasEstimate = await wallet.estimateGas(unsignedTx);
    unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

    const tx = await wallet.sendTransaction(unsignedTx);
    await tx.wait();
    txHash = tx.hash;

    expect(txHash).not.toBeUndefined();
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("Retrieve Shield.sol tx receipt", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
    });
    const txDetails = res.body.result;
    counterpartyShieldAddress = txDetails.contractAddress;
    expect(counterpartyShieldAddress).not.toBeUndefined();
    expect(counterpartyShieldAddress).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("Counterparty sends 1st leaf into untracked Shield contract", async () => {
    const sender = accounts[0];
    const nonce = await wallet.getTransactionCount();
    const proof = [5];
    const publicInputs = ["0xc2f480d4dda9f4522b9f6d590011636d904accfe59f12f9d66a0221c2558e3a2"]; // Sha256 hash of new commitment
    const newCommitment = "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";

    const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
    const txData = shieldInterface.encodeFunctionData(
      "verifyAndPush(uint256[],uint256[],bytes32)",
      [proof, publicInputs, newCommitment]
    );

    const unsignedTx = {
      to: counterpartyShieldAddress,
      from: sender,
      data: txData,
      nonce
    };

    const gasEstimate = await wallet.estimateGas(unsignedTx);
    unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

    const tx = await wallet.sendTransaction(unsignedTx);
    await tx.wait();
    expect(tx.hash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    const txReceipt = await web3provider.getTransactionReceipt(tx.hash);
    expect(txReceipt.status).toEqual(1);
  });

  test("baseline_track should initiate merkle tree in db", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_track",
      params: [counterpartyShieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    expect(res.body.result).toBe(true);
  });

  test("baseline_getCommit should detect 1st leaf already in tree", async () => {
    const leafIndex = 0;
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getCommit",
      params: [counterpartyShieldAddress, leafIndex],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const merkleNode = res.body.result;
    leafValue = merkleNode.hash;
    expect(merkleNode.hash).toEqual('0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');
    expect(merkleNode.leafIndex).toEqual(leafIndex);
  });

});

describe("Interact with Shield.sol contract", () => {
  let rootHash;
  let sender;
  let siblingNodes;
  let leafValue;

  beforeAll(async () => {
    sender = accounts[0];
  });

  test("baseline_track should initiate merkle tree in db", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_track",
      params: [shieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    expect(res.body.result).toBe(true);
  });

  test("baseline_getTracked should return deployed contract", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getTracked",
      params: [],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const foundContract = res.body.result.includes(shieldAddress);
    expect(foundContract).toBe(true);
  });

  test("baseline_verifyAndPush creates 1st leaf", async () => {
    const proof = [5];
    const publicInputs = ["0x02d449a31fbb267c8f352e9968a79e3e5fc95c1bbeaa502fd6454ebde5a4bedc"]; // Sha256 hash of new commitment
    const newCommitment = "0x1111111111111111111111111111111111111111111111111111111111111111";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verifyAndPush",
      params: [sender, shieldAddress, proof, publicInputs, newCommitment],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const txHash = res.body.result.txHash;
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    // ITX txs return relayHash, so need to be managed differently
    let txReceipt;
    if (txManager === 'infura-gas') {
      txReceipt = await waitRelayTx(txHash);
    } else {
      txReceipt = await web3provider.waitForTransaction(txHash);
    }
    expect(txReceipt.status).toEqual(1);
  });

  test("baseline_getRoot returns root hash", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getRoot",
      params: [shieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    rootHash = res.body.result;
    expect(rootHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
  });

  test("baseline_verifyAndPush creates 2nd leaf", async () => {
    const proof = [5];
    const publicInputs = ["0x9f72ea0cf49536e3c66c787f705186df9a4378083753ae9536d65b3ad7fcddc4"]; // Sha256 hash of new commitment
    const newCommitment = "0x2222222222222222222222222222222222222222222222222222222222222222";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verifyAndPush",
      params: [sender, shieldAddress, proof, publicInputs, newCommitment],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const txHash = res.body.result.txHash;
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    // ITX txs return relayHash, so need to be managed differently
    let txReceipt;
    if (txManager === 'infura-gas') {
      txReceipt = await waitRelayTx(txHash);
    } else {
      txReceipt = await web3provider.waitForTransaction(txHash);
    }
    expect(txReceipt.status).toEqual(1);
  });

  test("baseline_verifyAndPush creates 3rd leaf", async () => {
    const proof = [5];
    const publicInputs = ["0xdeb0e38ced1e41de6f92e70e80c418d2d356afaaa99e26f5939dbc7d3ef4772a"]; // Sha256 hash of new commitment
    const newCommitment = "0x3333333333333333333333333333333333333333333333333333333333333333";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verifyAndPush",
      params: [sender, shieldAddress, proof, publicInputs, newCommitment],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const txHash = res.body.result.txHash;
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    // ITX txs return relayHash, so need to be managed differently
    let txReceipt;
    if (txManager === 'infura-gas') {
      txReceipt = await waitRelayTx(txHash);
    } else {
      txReceipt = await web3provider.waitForTransaction(txHash);
    }
    expect(txReceipt.status).toEqual(1);
  });

  test("baseline_getRoot returns updated root hash", async () => {
    const rootHash_2 = await web3provider.send('baseline_getRoot', [shieldAddress]);
    expect(rootHash_2).toMatch(new RegExp("^0x[a-fA-F0-9]*"));
    expect(rootHash_2).not.toEqual(rootHash);
    rootHash = rootHash_2;
  });

  test("baseline_getCommit retrieves 3rd leaf", async () => {
    const leafIndex = 2;
    const merkleNode = await web3provider.send('baseline_getCommit', [
      shieldAddress, leafIndex
    ]);
    leafValue = merkleNode.hash;
    expect(merkleNode.hash).toEqual('0x3333333333333333333333333333333333333333333333333333333333333333');
    expect(merkleNode.leafIndex).toEqual(leafIndex);
  });

  test("baseline_getCommit fails to retrieve non-existent 5th leaf", async () => {
    const leafIndex = 4;
    const merkleNode = await web3provider.send('baseline_getCommit', [
      shieldAddress, leafIndex
    ]);
    expect(merkleNode).toEqual({});
  });

  test("baseline_getProof for 3rd leaf", async () => {
    const leafIndex = 2;
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getProof",
      params: [shieldAddress, leafIndex],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    siblingNodes = res.body.result;
    const numNodes = siblingNodes.length;
    expect(numNodes).toEqual(treeHeight + 1);
    expect(siblingNodes[numNodes - 1].hash).toEqual(rootHash);
  });

  test("baseline_verify for 3rd leaf", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verify",
      params: [
        shieldAddress,
        leafValue,
        siblingNodes
      ],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(true);
  });

  test("baseline_verifyAndPush creates 4th leaf", async () => {
    const proof = [5];
    const publicInputs = ["0xbb391415c05e39d77ca17381d3be3f7d0cd5e5332e5a579311adaa0aa62106e9"]; // Sha256 hash of new commitment
    const newCommitment = "0x4444444444444444444444444444444444444444444444444444444444444444";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verifyAndPush",
      params: [sender, shieldAddress, proof, publicInputs, newCommitment],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const txHash = res.body.result.txHash;
    expect(txHash).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    // ITX txs return relayHash, so need to be managed differently
    let txReceipt;
    if (txManager === 'infura-gas') {
      txReceipt = await waitRelayTx(txHash);
    } else {
      txReceipt = await web3provider.waitForTransaction(txHash);
    }
    expect(txReceipt.status).toEqual(1);
  });

  test("Off-chain root matches On-chain root", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getRoot",
      params: [shieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    const offchainRoot = res.body.result;
    expect(offchainRoot).toMatch(new RegExp("^0x[a-fA-F0-9]*"));

    const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
    const txData = shieldInterface.encodeFunctionData("latestRoot()", []);
    const res_2 = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [{
        "to": shieldAddress,
        "data": txData
      },
        "latest"
      ],
      id: 1,
    });
    expect(res_2.statusCode).toEqual(200);
    expect(res_2.body.error).toBeUndefined();
    expect(res_2.body.result).not.toBeUndefined();
    const onchainRoot = res_2.body.result;
    expect(onchainRoot).toEqual(offchainRoot);
  });

  test("baseline_track fails if already tracking contract", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_track",
      params: [shieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).not.toBeUndefined();
    expect(res.body.error.code).toEqual(-32603);
    expect(res.body.error.message.includes('Internal server error')).toBe(true);
    expect(res.body.error.data.includes('Already tracking MerkleTree at address')).toBe(true);
  });

  test("baseline_untrack should remove event listeners", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_untrack",
      params: [shieldAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    expect(res.body.result).toBe(true);
  });

  test("baseline_untrack with prune should delete tree from storage", async () => {
    const treesBefore = await mongoose.connection.collection('merkle-trees').countDocuments({});
    const prune = true;
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_untrack",
      params: [counterpartyShieldAddress, prune],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).not.toBeUndefined();
    expect(res.body.result).toBe(true);

    const treesAfter = await mongoose.connection.collection('merkle-trees').countDocuments({});
    expect(treesBefore).toEqual(treesAfter + 1);
  });

  test("baseline_getTracked no longer includes untracked address", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getTracked",
      params: [],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).toBeUndefined();
    expect(res.body.result).not.toBeUndefined();
    expect(res.body.result.includes(shieldAddress)).toBe(false);
  });

});

describe("Batched requests", () => {

  test("[ eth_accounts, baseline_getCommit, eth_accounts ]", async () => {
    const res = await apiRequest.post("/jsonrpc").send([
      {
        jsonrpc: "2.0",
        method: "eth_accounts",
        params: [],
        id: 1,
      },
      {
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress, 1],
        id: 1,
      },
      {
        jsonrpc: "2.0",
        method: "eth_accounts",
        params: [],
        id: 1,
      }
    ]);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].error).toBeUndefined();
    expect(res.body[1].error).toBeUndefined();
    expect(res.body[2].error).toBeUndefined();
    expect(res.body[0].result).not.toBeUndefined();
    expect(res.body[1].result).not.toBeUndefined();
    expect(res.body[2].result).not.toBeUndefined();
  });

  test("[ baseline_getCommit, baseline_getCommit ]", async () => {
    const res = await apiRequest.post("/jsonrpc").send([
      {
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress, 2],
        id: 1,
      },
      {
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress, 1],
        id: 1,
      },
    ]);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].error).toBeUndefined();
    expect(res.body[1].error).toBeUndefined();
    expect(res.body[0].result).not.toBeUndefined();
    expect(res.body[1].result).not.toBeUndefined();
  });

});

describe("Error checks", () => {
  let sender;

  beforeAll(async () => {
    sender = accounts[0];
  });

  test("jsonrpc method not found", async () => {
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "fake_method",
      params: [],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).not.toBeUndefined();
    // Ganache returns { code: -32000, message: "Internal server error" }
    // jsonrpc spec:   { code: -32001, message: "Method not found" }
  });

  test("baseline_getRoot fails for non-existent Merkle Tree", async () => {
    const fakeAddress = "0x1111111111111111111111111111111111111111111111111111111111111111";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_getRoot",
      params: [fakeAddress],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.error).not.toBeUndefined();
  });

  test("baseline_verifyAndPush fails when tree is full", async () => {
    const proof = [5];
    const publicInputs = ["0xbb391415c05e39d77ca17381d3be3f7d0cd5e5332e5a579311adaa0aa62106e9"]; // Sha256 hash of new commitment
    const newCommitment = "0x4444444444444444444444444444444444444444444444444444444444444444";
    const res = await apiRequest.post("/jsonrpc").send({
      jsonrpc: "2.0",
      method: "baseline_verifyAndPush",
      params: [sender, shieldAddress, proof, publicInputs, newCommitment],
      id: 1,
    });
    expect(res.statusCode).toEqual(200);
    const txHash = res.body.result ? res.body.result.txHash : undefined;

    if (txManager === 'besu') {
      // error occurs on internal "eth_estimateGas"
      expect(res.body.error).not.toBeUndefined();
    } else if (txManager === 'ganache') {
      // error visible in tx receipt: tx should have reverted
      const res_2 = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [txHash],
        id: 1,
      });
      expect(res_2.statusCode).toEqual(200);
      expect(res_2.body.error).toBeUndefined();
      expect(res_2.body.result).not.toBeUndefined();
      expect(res_2.body.result.status).toEqual("0x0");
    }
  });

  describe("Invalid number of params", () => {

    test("baseline_getCommit fails with less than 2 args", async () => {
      const res = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress],
        id: 1,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeUndefined();
      expect(res.body.error.code).toEqual(-32602);
      expect(res.body.error.message.includes('Invalid params')).toBe(true);
      expect(res.body.error.data.includes('Expected number of inputs to be')).toBe(true);
    });

    test("baseline_getCommit fails with greater than 2 args", async () => {
      const res = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress, 2, 3],
        id: 1,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeUndefined();
      expect(res.body.error.code).toEqual(-32602);
      expect(res.body.error.message.includes('Invalid params')).toBe(true);
      expect(res.body.error.data.includes('Expected number of inputs to be')).toBe(true);
    });

    test("baseline_getCommit fails if any args are passed as 'undefined'", async () => {
      const res = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "baseline_getCommit",
        params: [shieldAddress, undefined],
        id: 1,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeUndefined();
      expect(res.body.error.code).toEqual(-32602);
      expect(res.body.error.message.includes('Invalid params')).toBe(true);
      expect(res.body.error.data.includes('Param index')).toBe(true);
    });

  });

  describe("Invalid param values", () => {

    test("baseline_verifyAndPush fails for invalid contract address", async () => {
      const fakeContractAddress = "0xBADBADBADBADBADBADBADBADBADBADBADBADBAD0";
      const proof = [5];
      const publicInputs = ["0xdeb0e38ced1e41de6f92e70e80c418d2d356afaaa99e26f5939dbc7d3ef4772a"]; // Sha256 hash of new commitment
      const newCommitment = "0x3333333333333333333333333333333333333333333333333333333333333333";
      const res = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "baseline_verifyAndPush",
        params: [sender, fakeContractAddress, proof, publicInputs, newCommitment],
        id: 1,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeUndefined();
      expect(res.body.error.code).toEqual(-32603);
      expect(res.body.error.message.includes('Internal server error')).toBe(true);
      expect(res.body.error.data.includes('Merkle Tree not found in db')).toBe(true);
    });

    test("baseline_track fails for invalid contract address", async () => {
      const fakeContractAddress = "0xBADBADBADBADBADBADBADBADBADBADBADBADBAD0";
      const res = await apiRequest.post("/jsonrpc").send({
        jsonrpc: "2.0",
        method: "baseline_track",
        params: [fakeContractAddress],
        id: 1,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.error).not.toBeUndefined();
      expect(res.body.error.code).toEqual(-32603);
      expect(res.body.error.message.includes('Internal server error')).toBe(true);
      expect(res.body.error.data.includes('Could not retreive treeHeight from blockchain')).toBe(true);
    });

  });

});
