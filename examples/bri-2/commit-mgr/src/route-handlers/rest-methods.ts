import dotenv from 'dotenv';
import crypto from 'crypto';
import hash from 'object-hash';
import axios from 'axios';
import * as uuid from 'uuid';
import { chainName } from '../blockchain';
import { commits } from '../db/models/Commit';
import { merkleTrees } from '../db/models/MerkleTree';
import { contractBaseline } from '../db/models/Contract';
import { logger } from '../logger';
import { concatenateThenHash } from '../merkle-tree/hash';
import { verifyAndPush } from './rpc-methods';
import { signHash } from '../utils';
import { connectNATS } from '../nats';

dotenv.config();

export const getStatus = async (req: any, res: any) => {
  const db = {
    dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    dbHost: process.env.DATABASE_HOST
  };
  const name = chainName();
  const blockchain = {
    chainId: process.env.CHAIN_ID,
    chainName: name,
    walletAddress: process.env.WALLET_PUBLIC_KEY,
    infuraId: process.env.INFURA_ID,
    commitServerPort: process.env.SERVER_PORT
  };
  res.status(200);
  res.send({ db, blockchain });
};

export const getCommits = async (req: any, res: any) => {
  const workflowId = req.query.workflowId;
  const filter = workflowId ? { workflowId } : {};
  await commits.find(filter, (err: any, data: any) => {
    if (err) {
      logger.error(`Could not retrieve commits: ${err}`);
      res.send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const getCommit = async (req: any, res: any) => {
  await commits.findOne({ _id: req.params.commitId }, (err: any, data: any) => {
    if (err) {
      logger.error(`Could not retrieve commit: ${err}`);
      res.send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const createCommit = async (req: any, res: any) => {
  logger.info(`Received request to create new commit`);
  const newId = uuid.v4();
  let status = 'success-create';
  const { workflowId, rawData, workflowStep, eddsaKey, participants } = req.body;
  if (!Array.isArray(participants)) {
    res.status(400).send({ message: 'Error: participants must be provided as an array' });
    return;
  }

  // Check if provided workflowId exists. If it does, get its zkCircuitId
  let response;
  try {
    logger.info(`Querying workflow-mgr for workflowId ${workflowId}.`);
    response = await axios.get(`${process.env.WORKFLOW_MGR_URL}/workflows/${workflowId}`);
  } catch (err) {
    logger.error(`Axios error when calling workflow-mgr: ${err.message}`);
    res.status(500).send({ message: `Error when calling workflow-mgr: ${err.message}` });
    return;
  }

  const { zkCircuitId, shieldAddress } = response.data;

  // generate salt
  const salt = crypto.randomBytes(32).toString('hex');
  // sort json object alphabetically then hash
  const rawDataHash = hash(rawData, 'sha256');
  // const prevCommit = await getLatestCommit(workflowId);
  // value = H(salt + rawDataHash)
  const hashValue = concatenateThenHash(salt, rawDataHash);
  const { result: signature, error } = await signHash(eddsaKey, hashValue);
  if (error) {
    res.status(400).send({ message: error.message });
    return;
  }
  participants.push({
    self: true,
    signingKey: eddsaKey,
    signingKeyType: 'eddsa',
    signature
  });

  try {
    const newCommit = await commits.findOneAndUpdate(
      { _id: newId },
      {
        _id: newId,
        merkleId: shieldAddress,
        workflowId,
        zkCircuitId,
        rawData,
        salt,
        hashValue,
        participants,
        workflowStep: workflowStep || 1,
        status
      },
      { upsert: true, new: true }
    );
    logger.info(`New commit (id: ${newId}) created.`);
    res.status(201).send(newCommit || {});
  } catch (err) {
    logger.error(`Could not create new commit: ${err}`);
    res.status(500).send(err);
  }
};

export const signCommit = async (req: any, res: any) => {
  res.status(404).send('Not implemented');
};

export const generateProof = async (req: any, res: any) => {
  const { commitId } = req.params;
  if (!uuid.validate(commitId)) {
    logger.error(`Commit Id (${commitId}) is not a valid uuid.`);
    res.status(400).send({ message: `Error: Commit Id (${commitId}) is not a valid uuid.` });
    return;
  }

  logger.info(`Received request to generate proof for commitId ${commitId}`);
  const commit = await commits.findOne({ _id: commitId });

  let witness = [
    {
      inputType: 'hash',
      value: commit.hashValue
    }
  ];

  // Add each digital signature to the witness
  for (let i = 0; i < commit.participants.length; i++) {
    if (!commit.participants[i].signature) {
      res.status(400).send({ message: 'Error: commit needs more signatures before generating a proof' });
      return;
    }
    witness.push({
      inputType: 'signature',
      value: commit.participants[i].signature
    });
  }

  // Create job for zkp-mgr to generate a new zk proof
  const nc = await connectNATS();
  nc.publish('generate-zk-proof', {
    commitId,
    witness,
    hashValue: commit.hashValue,
    zkCircuitId: commit.zkCircuitId
  });

  res.status(200).send(`Created NATS job to generate proof for commitId ${commitId}`);
};

export const sendCommitToPartners = async (req: any, res: any) => {
  try {
    // send to partners via messenger
    const newCommit = await commits.findOneAndUpdate(
      { _id: req.params.commitId },
      { status: 'sent-to-participants' },
      { upsert: true, new: true }
    );
    res.send(newCommit || {});
  } catch (err) {
    logger.error(`Could not update commit: ${err}`);
    res.send(err);
  }
};

export const sendCommitOnChain = async (req: any, res: any) => {
  const commit = await commits.findOne({ _id: req.params.commitId });
  if (commit.status === 'success-send-on-chain' || commit.status === 'success-arrive-on-chain') {
    res.status(400).send({ message: 'Error: commit already successfully sent on-chain' });
    return;
  }
  const senderAddress = req.body.senderAddress || process.env.WALLET_PUBLIC_KEY;

  await commits.findOneAndUpdate(
    { _id: req.params.commitId },
    { status: 'success-send-on-chain' },
    { upsert: true }
  );

  // send on-chain via baseline_verifyAndPush
  // event listener should change status to "on-chain"
  const result = await verifyAndPush(
    senderAddress,
    commit.merkleId,
    commit.proofSolidity.a,
    [commit.proofSolidity.b0, commit.proofSolidity.b1],
    commit.proofSolidity.c,
    commit.publicInputs,
    commit.hashValue
  );

  logger.info(`[baseline_verifyAndPush] result: %o`, result);
  if (result.error) {
    logger.error(`Could not push new commit on-chain: %o`, result.error);
    await commits.findOneAndUpdate(
      { _id: req.params.commitId },
      { status: 'fail-send-to-chain' },
      { upsert: true }
    );
    res.status(500).send(result.error);
    return;
  }

  res.status(200).send({ txHash: result.txHash });
  return;
};

export const getMerkleTrees = async (req: any, res: any) => {
  await merkleTrees.find({}, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const getMerkleTree = async (req: any, res: any) => {
  await merkleTrees.findOne({ _id: req.params.treeId }, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const createMerkleTree = async (req: any, res: any) => {
  // Create new MerkleTree instance in db
  const newId = uuid.v4();
  await merkleTrees.findOneAndUpdate(
    {
      _id: `${newId}_0`,
      network: {
        name: 'local-db'
      },
      treeHeight: req.body.treeHeight || 4,
      active: true
    },
    (err: any, data: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data || {});
      }
    }
  );
};

export const deleteMerkleTree = async (req: any, res: any) => {
  await merkleTrees.deleteOne({ _id: req.params.treeId }, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  });
};

export const deleteAllMerkleTrees = async (req: any, res: any) => {
  await merkleTrees.deleteMany({}, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  });
};

export const getContracts = async (req: any, res: any) => {
  const network = req.query.network;
  const filter = network ? { network } : {};

  await contractBaseline.find(filter, (err: any, data: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const deleteAllContracts = async (req: any, res: any) => {
  await contractBaseline.deleteMany({}, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send();
    }
  });
};

export const getSettings = async (req: any, res: any) => {
  const data = {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    ETH_CLIENT_TYPE: process.env.ETH_CLIENT_TYPE,
    ETH_CLIENT_WS: process.env.ETH_CLIENT_WS,
    ETH_CLIENT_HTTP: process.env.ETH_CLIENT_HTTP,
    CHAIN_ID: process.env.CHAIN_ID,
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
    WALLET_PUBLIC_KEY: process.env.WALLET_PUBLIC_KEY
  };
  res.send(data || {});
};
