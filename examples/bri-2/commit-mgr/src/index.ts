import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ethers } from "ethers";
import { rpcServer } from "./rpc-server";
import { logger, reqLogger, reqErrorLogger } from "./logger";
import { dbConnect } from "./db";
import { merkleTrees } from "./db/models/MerkleTree";
import { commitmentBaseline } from "./db/models/Commitment";
import { contractBaseline } from "./db/models/Contract";
import { phonebookBaseline } from "./db/models/Phonebook";
import { didIdentityManagerCreateIdentity, didGenerateDidConfiguration, didVerifyWellKnownDidConfiguration } from "./blockchain/did";
import { get_ws_provider, restartSubscriptions, sendBaselineBalance, deployContracts, sendCommit, sendBaselineTrack, sendBaselineGetTracked, sendBaselineVerifyAndPush, sendFirstLeaf, runTests, switchChain } from "./blockchain";

import * as fs from 'fs';
import * as path from 'path';

import { web3provider, wallet, txManager, waitRelayTx, deposit, getBalance } from "./blockchain/chain";

import * as shieldContract from "./contracts/artifacts/Shield.json";
import * as verifierContract from "./contracts/artifacts/VerifierNoop.json";

const saveEnv = async (settings: any, envfile: string) => {

  fs.writeFile(path.join(__dirname, envfile), settings,  (err) => {
    if (err) {
        return logger.error(err);
    }
    logger.info(".env file created!");
  });

}

const savePhonebookEntry = async (entryInfo: any) => {

  if (!entryInfo) {
    logger.error("No domain to save...");
    return false;
  }

  const newPhonebook = new phonebookBaseline({
    name: entryInfo.name, // entity name
    network: entryInfo.network, // did network
    domain: entryInfo.domain, // did domain
    dididentity: entryInfo.dididentity, // did identity
    status: entryInfo.status, // did verification status
    active: true
  });

  await newPhonebook.save((err) => {
    if (err) {
      logger.error(err);
      return false;
    }
    // saved!
    logger.info(`[ ${entryInfo.name} ] domain added to phonebook...`);
    return true;
  });

}

const saveCommiment = async (commitInfo: any) => {

  if (!commitInfo) {
    logger.error("No commitment to save...");
    return false;
  }

  const newCommitment = new commitmentBaseline({
    commitHash: commitInfo.commitHash, // Sha256 hash of new commitment
    commitment: commitInfo.commitment, // did network
    network: 'local' // always local network *TODO
  });

  await newCommitment.save((err) => {
    if (err) {
      logger.error(err);
      return false;
    }
    // saved!
    logger.info(`[ ${newCommitment.commitment} ] commitment added to DB...`);
    return true;
  });

}


const saveContract = async (contractInfo: any) => {

  if (!contractInfo) {
    logger.error("No contract to save...");
    return false;
  }

  const newContract = new contractBaseline({
    name: contractInfo.name, // Contract name
    network: contractInfo.network, // Contract network
    blockNumber: contractInfo.blockNumber, // Last interation block number
    txHash: contractInfo.txHash, // Tx Hash
    address: contractInfo.address, // contract address
    active: contractInfo.active
  });

  await newContract.save((err) => {
    if (err) {
      logger.error(err);
      return false;
    }
    // saved!
    logger.info(`[ ${contractInfo.name} ] contract added to DB...`);
    return true;
  });

}

const deployVerifierContract = async (sender: string, network: string) => {
  let txHash;
  const nonce = await wallet.getTransactionCount();
  const unsignedTx = {
    from: sender,
    data: verifierContract.bytecode,
    nonce,
    gasLimit: 0
  }

  const gasEstimate = await wallet.estimateGas(unsignedTx);
  logger.debug(`gasEstimate: ${gasEstimate}`);
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
  logger.debug(`GasLimit: ${unsignedTx.gasLimit}`)

  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  txHash = tx.hash;

  return txHash;
}


const deployShieldContract = async (sender: string, verifierAddress: string, network: string, treeHeight: number) => {
  let txHash;
  const nonce = await wallet.getTransactionCount();
  const abiCoder = new ethers.utils.AbiCoder();
  // Encode the constructor parameters, then append to bytecode
  const encodedParams = abiCoder.encode(["address", "uint"], [verifierAddress, treeHeight]);
  const bytecodeWithParams = verifierContract.bytecode + encodedParams.slice(2).toString();
  const unsignedTx = {
    from: sender,
    data: bytecodeWithParams,
    nonce,
    gasLimit: 0
  };

  const gasEstimate = await wallet.estimateGas(unsignedTx);
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
  logger.debug(`gasEstimate: ${gasEstimate}`);
  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  txHash = tx.hash;

  // sendFirstLeaf(sender, )

  return txHash;
}




const main = async () => {
  dotenv.config();
  const port = process.env.SERVER_PORT;

  logger.info("Starting commmitment manager server...");
  logger.debug(`shieldContract: ${shieldContract.contractName}`);
  logger.debug(`verifierContract: ${verifierContract.contractName}`)

  const dbUrl = 'mongodb://' +
    `${process.env.DATABASE_USER}` + ':' +
    `${process.env.DATABASE_PASSWORD}` + '@' +
    `${process.env.DATABASE_HOST}` + '/' +
    `${process.env.DATABASE_NAME}`;

  logger.debug(`Attempting to connect to db: ${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`)

  await dbConnect(dbUrl);
  await get_ws_provider(); // Establish websocket connection
  await restartSubscriptions(); // Enable event listeners for active MerkleTrees

  const app = express();

  // Set up a whitelist and check against it:
  /*var whitelist = ['http://localhost:3000', 'http://localhost:4001']
  var corsOptions = {
    origin: function (origin, callback) {
    8  if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }*/

  app.use(reqLogger('COMMIT-MGR')); // Log requests
  app.use(reqErrorLogger('COMMIT-MGR')); // Log errors
  app.use(bodyParser.json({ limit: "2mb" })); // Pre-parse body content
  app.use(cors());

  app.get('/status', async (req: any, res: any) => {
    res.sendStatus(200);
  });

  app.get('/network-mode', async (req: any, res: any) => {

    /*# Chain ID
    # 1: Mainnet
    # 3: Ropsten
    # 4: Rinkeby
    # 5: Goerli
    # 42: Kovan
    # 101010: Custom network (private ganache or besu network)*/

    let chainName;
    switch (parseInt(process.env.CHAIN_ID, 10)) {
      case 1:
        chainName = 'MAINNET';
        break;
      case 3:
        chainName = 'ROPSTEN';
        break;
      case 4:
        chainName = 'RINKEBY';
        break;
      case 5:
        chainName = 'GOERLI';
        break;
      case 42:
        chainName = 'KOVAN';
        break;
      case 101010:
        chainName = 'LOCAL';
        break;
      default:
        chainName = 'LOCAL';
        break;
    }

    const result = {
      chainId: process.env.CHAIN_ID,
      chainName,
      walletAddress: process.env.WALLET_PUBLIC_KEY,
      infuraId: process.env.INFURA_ID,
      commitServerPort: process.env.SERVER_PORT
    }
    res.send(result || {});
  });


  app.get('/db-status', async (req: any, res: any) => {

    const result =  {
      dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
      dbHost: process.env.DATABASE_HOST
    }

    res.send(result || {});
  });

  /*app.get('/shell', async (req: any, res: any) => {

    const execInfo = req.body;

    if (!execInfo) {
      logger.error("No  command to execute...");
      return false;
    }
    // const result = await didGenerateDidConfiguration('autotoyz.open4g.com');
    // const result = await didGenerateDidConfiguration('{}');
    const result = await didVerifyWellKnownDidConfiguration('tailwindpower.netlify.app');

    res.send(result || {});
  });*/

  app.post('/switch-chain', async (req: any, res: any) => {

    const execInfo = req.body;

    if (!execInfo) {
      logger.error("No  command to execute...");
      return false;
    }
    // const result = await didGenerateDidConfiguration('autotoyz.open4g.com');
    // const result = await didGenerateDidConfiguration('{}');
    const result = await switchChain(execInfo.network);

    res.send(result || {});
  });


  // api for get local commitments data from database
  app.get("/get-commiments", async (req: any, res: any) => {
    await commitmentBaseline.find({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  app.post('/did-generate', async (req: any, res: any) => {

    const execInfo = req.body;

    if (!execInfo) {
      logger.error("No  command to execute...");
      return false;
    }
    const result = await didGenerateDidConfiguration(execInfo.did, execInfo.domain);

    res.send(result || {});
  });


  app.post('/did-create-identity', async (req: any, res: any) => {

    const execInfo = req.body ? req.body : '{}';

    if (!execInfo) {
      logger.error("No  command to execute...");
      return false;
    }
    const result = await didIdentityManagerCreateIdentity(execInfo.domain);

    res.send(result || {});
  });


  app.post('/did-verify', async (req: any, res: any) => {

    const execInfo = req.body;

    if (!execInfo) {
      logger.error("No  command to execute...");
      return false;
    }
    const result = await didVerifyWellKnownDidConfiguration(execInfo.domain);

    res.send(result || {});
  });


  app.post('/add-phonebook', async (req: any, res: any) => {

    const entryInfo = req.body;
    const resultDid = await didVerifyWellKnownDidConfiguration(entryInfo.domain);

    try {

      if (!entryInfo) {
        logger.error("No domain to add...");
        throw new Error("No domain to add...");
      }

      let result;

      if (resultDid){

        try {
          result = JSON.parse(resultDid);
        } catch (e) {
          logger.error(e);
          res.status(404).send("Failed to download the .well-known DID from domain");
        }

        if (result.domain == null){
          res.status(404).send("Failed to download the .well-known DID from domain");
          // return false;
        }

        const phoneEntry = {
          name: result.domain,
          network: result.dids[0].split(':')[1] === 'key' ? '-key-' : result.dids[0].split(':')[2], // did network
          domain: result.domain, // did domain
          dididentity: result.dids[0], // did identity
          status: 'verified', // did verification status
          active: true
        }
        await savePhonebookEntry(phoneEntry);
        res.send(result || {});

      } else {

        throw new Error("Failed to download the .well-known DID from domain");
      }

      // res.send(result || {});

    } catch (error) {
      return error;
    }

  });


  // api for get merkle data from database
  app.get("/remove-phonebook/:entryId", async (req: any, res: any) => {
    await phonebookBaseline.deleteOne({_id: req.params.entryId}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  // api for get merkle data from database
  app.get("/get-phonebook", async (req: any, res: any) => {
    await phonebookBaseline.find({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  // api for get merkle data from database
  app.get("/getmerkletrees", async (req: any, res: any) => {
    await merkleTrees.find({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  app.get("/getmerkletree/:addressId", async (req: any, res: any) => {
    await merkleTrees.findOne({_id: req.params.addressId}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });

  // delete db merkletree for a specific contract info from database
  app.post("/delete-merkletree", async (req: any, res: any) => {
    await merkleTrees.deleteOne({_id: req.params.addressId}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });

  // delete db contract info from database
  app.post("/reset-merkletree", async (req: any, res: any) => {
    await merkleTrees.deleteMany({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  // delete db contract info from database
  app.post("/reset-contracts", async (req: any, res: any) => {
    await commitmentBaseline.deleteMany({}, (err: any, data: any) => {
      if (err) {
          logger.error(err);
      } else {
          logger.debug(data || {});
      }
    });

    await merkleTrees.deleteMany({}, (err: any, data: any) => {
      if (err) {
          logger.error(err);
      } else {
          logger.debug(data || {});
      }
    });

    await contractBaseline.deleteMany({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  // api for get contracts data from database
  app.get("/contracts-available", async (req: any, res: any) => {
    await contractBaseline.find({}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });

  // api for get contracts data from database
  app.get("/contracts-local", async (req: any, res: any) => {
    await contractBaseline.find({network: 'local'}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });

          // api for get contracts data from database
  app.get("/contracts/:networkId", async (req: any, res: any) => {
    await contractBaseline.find({network: req.params.networkId}, (err: any, data: any) => {
              if (err) {
                  res.send(err);
              } else {
                  res.send(data || {});
              }
          });
  });


  app.post("/send-commit", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let txHash;

    if (!deployInfo) {
      logger.error("No commit found...");
      return false;
    }

    logger.info(`Sender Address: ${deployInfo.sender}`);
    logger.info(`Shield Contract Address: ${deployInfo.shieldAddress}`);
    logger.info(`New Commitment Sent: ${deployInfo.newCommitment}`);
    // await sendBaselineTrack(deployInfo.shieldAddress, deployInfo.network);
    // const shieldTracked = await sendBaselineGetTracked();

    // if (shieldTracked)
    //  logger.info(`Shield Contract Tracked: ${shieldTracked}`);

    // txHash = await sendBaselineVerifyAndPush(deployInfo.sender, deployInfo.shieldAddress, deployInfo.network);
    txHash = await sendCommit(deployInfo.newCommitment, deployInfo.sender, deployInfo.shieldAddress, deployInfo.network, saveCommiment);

    if (txHash)
      res.send(txHash || null)
    else
      res.send({message: "Could not retreive commit from blockchain..."})

  });



  app.post("/send-first-commit", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let txHash;

    if (!deployInfo) {
      logger.error("No commit found...");
      return false;
    }

    logger.info(`Sender Address: ${deployInfo.sender}`);
    logger.info(`Shield Contract Address: ${deployInfo.shieldAddress}`);
    // await sendBaselineTrack(deployInfo.shieldAddress, deployInfo.network);
    // const shieldTracked = await sendBaselineGetTracked();

    // if (shieldTracked)
    //  logger.info(`Shield Contract Tracked: ${shieldTracked}`);

    // txHash = await sendBaselineVerifyAndPush(deployInfo.sender, deployInfo.shieldAddress, deployInfo.network);
    txHash = await sendCommit(deployInfo.sender, deployInfo.shieldAddress, deployInfo.network);

    if (txHash)
      res.send(txHash || null)
    else
      res.send({message: "Could not retreive commit from blockchain..."})

  });


  app.post("/run-tests", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let txHash;

    if (!deployInfo) {
      logger.error("No params found...");
      return false;
    }

    logger.info(`Sender Address: ${deployInfo.sender}`);
    logger.info(`Shield Contract Address: ${deployInfo.shieldAddress}`);
    logger.info(`Verifier Contract Address: ${deployInfo.verifierAddress}`);
    // await sendBaselineTrack(deployInfo.shieldAddress, deployInfo.network);
    // const shieldTracked = await sendBaselineGetTracked();

    // if (shieldTracked)
    //  logger.info(`Shield Contract Tracked: ${shieldTracked}`);

    // txHash = await sendBaselineVerifyAndPush(deployInfo.sender, deployInfo.shieldAddress, deployInfo.network);
    // txHash = await sendFirstLeaf(deployInfo.sender, deployInfo.shieldAddress, deployInfo.network);
    txHash = await runTests(deployInfo.sender, deployInfo.verifierAddress, deployInfo.network, saveContract);

    if (txHash)
      res.send(txHash || null)
    else
      res.send({message: "Could not run tests..."})

  });



  app.post("/deploy-shield-contract", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let txHash;

    if (!deployInfo) {
      logger.error("No contract to deploy...");
      return false;
    }

    logger.info(`Sender Address: ${deployInfo.sender}`);
    txHash = await deployShieldContract(deployInfo.sender, deployInfo.verifierAddress, deployInfo.network, 2);

    if (txHash)
      res.send(txHash || null)
    else
      res.send({message: "None contract to save..."})

  });


  app.post("/deploy-verifier-contract", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let txHash;

    if (!deployInfo) {
      logger.error("No contract to deploy...");
      return false;
    }

    logger.info(`Sender Address: ${deployInfo.sender}`);
    txHash = await deployVerifierContract(deployInfo.sender, deployInfo.network);

    if (txHash)
      res.send(txHash || null)
    else
      res.send({message: "None contract to save..."})

  });


  app.post("/deploy-contracts", async (req: any, res: any, next: any) => {

    const deployInfo = req.body;
    let contractsDeployed;

    if (!deployInfo) {
      logger.error("No contracts to deploy...");
      return false;
    }
    if (!deployInfo.sender){
      deployInfo.sender = process.env.WALLET_PUBLIC_KEY;
    }

    contractsDeployed = await deployContracts(deployInfo.sender, undefined, deployInfo.network, saveContract, saveCommiment);

    if (contractsDeployed)
      res.send(contractsDeployed || null)
    else
      res.send({message: "None contract to deploy..."})

  });


  app.post("/save-contract", async (req: any, res: any, next: any) => {

    const contractInfo = req.body;

    if (!contractInfo) {
      logger.error("No contract to save...");
      return false;
    }

    if (saveContract(contractInfo))
      res.sendStatus(200);
    else
    res.send({message: "None contract to save..."});

  });


  app.post("/save-settings", async (req: any, res: any, next: any) => {

    const settings = req.body;

    if (!settings) {
      logger.error("None settings to save...");
      return false;
    }

    saveEnv(`# Set to production when deploying to production
NODE_ENV="development"
LOG_LEVEL="debug"

# Node.js server configuration
SERVER_PORT=4001

# MongoDB configuration for the JS client
DATABASE_USER="${settings.DATABASE_USER}"
DATABASE_PASSWORD="${settings.DATABASE_PASSWORD}"
DATABASE_HOST="${settings.DATABASE_HOST}"
DATABASE_NAME="${settings.DATABASE_NAME}"

# Ethereum client
# "ganache": local, private ganache network
# "besu": local, private besu network
# "infura-gas": Infura's Managed Transaction (ITX) service
# "infura": Infura's traditional jsonrpc API
ETH_CLIENT_TYPE="${settings.LOCAL_ETH_CLIENT_TYPE}"

# Local client endpoints
# Websocket port
# 8545: ganache
# 8546: besu
ETH_CLIENT_WS="${settings.LOCAL_ETH_CLIENT_WS}"
ETH_CLIENT_HTTP="${settings.LOCAL_ETH_CLIENT_HTTP}"

# Chain ID
# 1: Mainnet
# 3: Ropsten
# 4: Rinkeby
# 5: Goerli
# 42: Kovan
# 101010: Custom network (private ganache or besu network)
CHAIN_ID=${settings.LOCAL_CHAIN_ID}

# Ethereum account key-pair. Do not use in production
WALLET_PRIVATE_KEY="${settings.LOCAL_WALLET_PRIVATE_KEY}"
WALLET_PUBLIC_KEY="${settings.LOCAL_WALLET_PUBLIC_KEY}"
`, "../../.env");

// ##################### LIVE DEV
saveEnv(`# Set to production when deploying to production
NODE_ENV="development"
LOG_LEVEL="debug"

# Node.js server configuration
SERVER_PORT=4001

# MongoDB configuration for the JS client
DATABASE_USER="${settings.DATABASE_USER}"
DATABASE_PASSWORD="${settings.DATABASE_PASSWORD}"
DATABASE_HOST="${settings.DATABASE_HOST}"
DATABASE_NAME="${settings.DATABASE_NAME}"

# Ethereum client
# "ganache": local, private ganache network
# "besu": local, private besu network
# "infura-gas": Infura's Managed Transaction (ITX) service
# "infura": Infura's traditional jsonrpc API
ETH_CLIENT_TYPE="${settings.LOCAL_ETH_CLIENT_TYPE}"

# Infura key
INFURA_ID=""

# Local client endpoints
# Websocket port
# 8545: ganache
# 8546: besu
ETH_CLIENT_WS="${settings.LOCAL_ETH_CLIENT_WS}"
ETH_CLIENT_HTTP="${settings.LOCAL_ETH_CLIENT_HTTP}"

# Chain ID
# 1: Mainnet
# 3: Ropsten
# 4: Rinkeby
# 5: Goerli
# 42: Kovan
# 101010: Custom network (private ganache or besu network)
CHAIN_ID=${settings.LOCAL_CHAIN_ID}

# Ethereum account key-pair. Do not use in production
WALLET_PRIVATE_KEY="${settings.LOCAL_WALLET_PRIVATE_KEY}"
WALLET_PUBLIC_KEY="${settings.LOCAL_WALLET_PUBLIC_KEY}"
`, "../../.env.localdev");


// ##################### LIVE ENV
saveEnv(`# Set to production when deploying to production
NODE_ENV="production"
LOG_LEVEL="debug"

# Node.js server configuration
SERVER_PORT=4001

# MongoDB configuration for the JS client
DATABASE_USER="${settings.DATABASE_USER}"
DATABASE_PASSWORD="${settings.DATABASE_PASSWORD}"
DATABASE_HOST="${settings.DATABASE_HOST}"
DATABASE_NAME="${settings.DATABASE_NAME}"

# Ethereum client
# "ganache": local, private ganache network
# "besu": local, private besu network
# "infura-gas": Infura's Managed Transaction (ITX) service
# "infura": Infura's traditional jsonrpc API
ETH_CLIENT_TYPE="${settings.ETH_CLIENT_TYPE}"

# Infura key
INFURA_ID="${settings.INFURA_ID}"

# Local client endpoints
# Websocket port
# 8545: ganache
# 8546: besu
ETH_CLIENT_WS="${settings.ETH_CLIENT_WS}"
ETH_CLIENT_HTTP="${settings.ETH_CLIENT_HTTP}"

# Chain ID
# 1: Mainnet
# 3: Ropsten
# 4: Rinkeby
# 5: Goerli
# 42: Kovan
# 101010: Custom network (private ganache or besu network)
CHAIN_ID=${settings.CHAIN_ID}

# Ethereum account key-pair. Do not use in production
WALLET_PRIVATE_KEY="${settings.WALLET_PRIVATE_KEY}"
WALLET_PUBLIC_KEY="${settings.WALLET_PUBLIC_KEY}"
`, "../../.env.network");

    res.sendStatus(200);
  });


  // Single endpoint to handle all JSON-RPC requests
  app.post("/jsonrpc", async (req: any, res: any, next: any) => {
    const context = {
      headers: req.headers,
      params: req.params,
      body: req.body,
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress,
    };

    await rpcServer.call(req.body, context, (err: any, result: any) => {
      if (err) {
        const errorMessage = err.error.data ? `${err.error.message}: ${err.error.data}` : `${err.error.message}`;
        logger.error(`Response error: ${errorMessage}`);
        res.send(err);
        return;
      }
      res.send(result || {});
    });
  });

  app.listen(port, () => {
    logger.info(`REST server listening on port ${port}.`);
  });
};

main();
