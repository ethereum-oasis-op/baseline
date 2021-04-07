import dotenv from "dotenv";
import crypto from "crypto";
import hash from "object-hash";
import { v4 } from 'uuid';
import { chainName } from "../blockchain";
import { commits } from "../db/models/Commit";
import { merkleTrees } from "../db/models/MerkleTree";
import { contractBaseline } from "../db/models/Contract";
import { logger } from "../logger";
import { concatenateThenHash } from "../merkle-tree/hash"
import { verifyAndPush } from "./rpc-methods";
import { saveEnv } from "../config";

dotenv.config();

export const getStatus = async (req: any, res: any) => {
    const db =  {
      dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
      dbHost: process.env.DATABASE_HOST
    }
    const name = chainName();
    const blockchain = {
      chainId: process.env.CHAIN_ID,
      chainName: name,
      walletAddress: process.env.WALLET_PUBLIC_KEY,
      infuraId: process.env.INFURA_ID,
      commitServerPort: process.env.SERVER_PORT
    }
    res.status(200);
    res.send({ db, blockchain });
};

export const getCommits = async (req: any, res: any) => {
    const workflowId = req.query.workflowId;
    const filter = workflowId ? { workflowId } : {} ;
    await commits.find(filter, (err: any, data: any) => {
      if (err) {
          logger.error(`Could not retrieve commits: ${err}`)
          res.send(err);
      } else {
          res.send(data || {});
      }
    });
};

export const getCommit = async (req: any, res: any) => {
    await commits.findOne({ _id: req.params.commitId }, (err: any, data: any) => {
      if (err) {
          logger.error(`Could not retrieve commits: ${err}`)
          res.send(err);
      } else {
          res.send(data || {});
      }
    });
};

export const createCommit = async (req: any, res: any) => {
    const newId = v4();
    const { merkleId, workflowId, rawData, workflowStep } = req.body;
    // generate salt
    const salt = crypto.randomBytes(32).toString('hex');
    // sort json object alphabetically then hash
    const rawDataHash = hash(rawData, 'sha256');
    // value = H(rawDataHash + salt)
    const value = concatenateThenHash(rawDataHash, salt);
    // run zkp verification?
    try {
      const newCommit = await commits.findOneAndUpdate(
        { _id: newId },
        {
          _id: newId,
          merkleId,
          workflowId,
          rawData,
          salt,
          value,
          workflowStep: workflowStep || 1,
          status: "created"
        },
        { upsert: true, new: true }
      );
      logger.info(`New commit (id: ${newId}) created.`)
      res.send(newCommit || {});
    } catch (err) {
      logger.error(`Could not create new commit: ${err}`)
      res.send(err);
    }
};

export const sendCommitToPartners = async (req: any, res: any) => {
    try {
      // send to partners via messenger
      const newCommit = await commits.findOneAndUpdate(
        { _id: req.params.commitId },
        { status: "sent-to-partners" },
        { upsert: true, new: true }
      );
      res.send(newCommit || {});
    } catch (err) {
      logger.error(`Could not update commit: ${err}`)
      res.send(err);
    }
};

export const sendCommitMainnet = async (req: any, res: any) => {
    const commit = await commits.findOne({ _id: req.params.commitId });
    if (commit.status === "mainnet") {
      res.status(400).send({ message: "Error: commit already on mainnet" });
      return;
    }
    const senderAddress = req.body.senderAddress || process.env.WALLET_PUBLIC_KEY;
    const proof = req.body.proof || commit.proof;
    const publicInputs = req.body.publicInputs || commit.publicInputs;

    // Update commit to ensure it has proof, publicInputs
    await commits.findOneAndUpdate(
      { _id: req.params.commitId },
      {
        status: "sent-mainnet",
        proof,
        publicInputs
      },
      { upsert: true }
    );

    // send on-chain via baseline_verifyAndPush
    // event listener should change status to "on-chain"
    const result = await verifyAndPush(senderAddress, commit.merkleId, proof, publicInputs, commit.value);
    logger.info(`[baseline_verifyAndPush] result: %o`, result)
    if (result.error) {
      logger.error(`Could not push new commit on-chain: %o`, result.error)
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
  await merkleTrees.findOne({_id: req.params.treeId}, (err: any, data: any) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const createMerkleTree = async (req: any, res: any) => {
  // Create new MerkleTree instance in db
  const newId = v4();
  await merkleTrees.insertOne(
    {
      _id: `${newId}_0`,
      network: {
        name: "local-db"
      },
      treeHeight: req.body.treeHeight || 4,
      active: true
    }, (err: any, data: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data || {});
      }
  });
};

export const deleteMerkleTree = async (req: any, res: any) => {
  await merkleTrees.deleteOne({_id: req.params.treeId}, (err: any, data: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || {});
    }
  });
};

export const deleteAllMerkleTrees = async (req: any, res: any) => {
  await merkleTrees.deleteMany({}, (err: any, data: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || {});
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
  await contractBaseline.deleteMany({}, (err: any, data: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data || {});
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
  }
  res.send(data || {});
};

export const saveSettings = async (req: any, res: any, next: any) => {
  const settings = req.body;
  if (!settings) {
    logger.error("No settings provided for storage in .env file");
    res.status(400).send({ error: 'No settings provided' })
    return;
  }
  saveEnv(settings)
  res.sendStatus(200);
};