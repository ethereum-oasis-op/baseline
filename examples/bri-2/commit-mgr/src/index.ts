import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger, reqLogger, reqErrorLogger } from './logger';
import { dbConnect } from './db';
import { connectNATS } from './nats';
import { get_ws_provider, restartSubscriptions } from './blockchain';
import { jsonRpcHandler } from './route-handlers/rpc-methods';
import {
  getStatus,
  getSettings,
  getCommits,
  getCommit,
  createCommit,
  sendCommitToPartners,
  sendCommitOnChain,
  getMerkleTrees,
  getMerkleTree,
  createMerkleTree,
  deleteMerkleTree,
  deleteAllMerkleTrees,
  getContracts,
  deleteAllContracts
} from './route-handlers/rest-methods';

const main = async () => {
  logger.info('Starting commitment manager server...');
  dotenv.config();
  const port = process.env.SERVER_PORT;
  const dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;

  logger.debug(`Attempting to connect to db: ${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`);
  await dbConnect(dbUrl);
  await connectNATS();
  await get_ws_provider(); // Establish websocket connection
  await restartSubscriptions(); // Enable event listeners for active MerkleTrees

  const app = express();
  app.use(reqLogger('COMMIT-MGR')); // Log requests
  app.use(reqErrorLogger('COMMIT-MGR')); // Log errors
  app.use(bodyParser.json({ limit: '2mb' })); // Pre-parse body content
  app.use(cors());

  app.get('/status', getStatus);
  app.get('/settings', getSettings);
  app.get('/commits', getCommits);
  app.get('/commits/:commitId', getCommit);
  app.post('/commits', createCommit);
  app.post('/commits/:commitId/send-partners', sendCommitToPartners);
  app.post('/commits/:commitId/send-mainnet', sendCommitOnChain);
  app.get('/merkle-trees', getMerkleTrees);
  app.get('/merkle-trees/:treeId', getMerkleTree);
  app.post('/merkle-trees', createMerkleTree);
  app.post('/merkle-trees/:treeId/delete', deleteMerkleTree);
  app.post('/delete/merkle-trees', deleteAllMerkleTrees);
  app.post('/delete/contracts', deleteAllContracts);
  app.get('/contracts', getContracts);

  // Single endpoint to handle all JSON-RPC requests
  // app.use(rpcServer.middleware());
  app.post('/jsonrpc', jsonRpcHandler);

  app.listen(port, () => {
    logger.info(`REST server listening on port ${port}.`);
  });
};
main();
