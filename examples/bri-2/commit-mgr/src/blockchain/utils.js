import dotenv from "dotenv";
import axios from 'axios';
import { ethers } from 'ethers';

import { logger } from "../logger";
import { insertLeaf } from "../merkle-tree/leaves";
import { merkleTrees } from "../db/models/MerkleTree";
import { shieldContract } from "./shield-contract";
import { newLeafEvent, subscribeMerkleEvents } from "./events";

dotenv.config();

let ws_provider;

export const http_provider = new ethers.providers.JsonRpcProvider(process.env.ETH_CLIENT_HTTP);
export const get_ws_provider = () => {
  if (!ws_provider) {
    try {
      ws_provider = new ethers.providers.WebSocketProvider(process.env.ETH_CLIENT_WS);
      ws_provider._websocket.on("error", (error) => {
        logger.error(`[WEBSOCKET] "error" event: ${error.stack}`);
        ws_provider = undefined;
      });
      ws_provider._websocket.on("close", (event) => {
        logger.error(`[WEBSOCKET] "close" event: ${event}`);
        ws_provider = undefined;
      });
      logger.info(`Established websocket connection: ${process.env.ETH_CLIENT_WS}`);
    } catch (err) {
      logger.error(`[WEBSOCKET] Cannot establish connection: ${process.env.ETH_CLIENT_WS}`);
    }
  }
  return ws_provider;
}

// Meant to be called everytime this commit-mgr service is restarted
export const restartSubscriptions = async () => {
  const activeTrees = await merkleTrees.find({
    _id: { $regex: /_0$/ },
    active: true
  });

  const provider = get_ws_provider();
  provider.on('block', async (result) => {
    logger.debug(`NEW BLOCK: %o`, result)
  });

  // For all 'active' MerkleTrees, search through old logs for any 
  // newLeaf events we missed while service was offline. Then resubscribe
  // to the events.
  for (let i = 0; i < activeTrees.length; i++) {
    const contractAddress = activeTrees[i]._id.slice(0, -2);
    const fromBlock = activeTrees[i].latestLeaf ? activeTrees[i].latestLeaf.blockNumber : 0;
    await checkChainLogs(contractAddress, fromBlock);
    subscribeMerkleEvents(contractAddress);
  }
}

export const checkChainLogs = async (contractAddress, fromBlock) => {
  // If fromBlock is provided, check next block so we don't add a leaf that was already captured
  const blockNum = fromBlock ? fromBlock + 1 : 0;
  logger.info(`Checking chain logs for missed newLeaf events starting at block ${fromBlock} for contract: ${contractAddress}`);
  // besu has a bug where 'eth_getLogs' expects 'fromBlock' to be a string instead of integer
  let convertedBlockNum = blockNum;
  switch (process.env.ETH_CLIENT_TYPE) {
    case "besu":
      convertedBlockNum = `${blockNum}`;
      break;
    case "infura-gas":
      convertedBlockNum = "0x" + blockNum.toString(16);
      break;
    case "infura":
      convertedBlockNum = "0x" + blockNum.toString(16);
      break;
  };

  const params = {
    fromBlock: convertedBlockNum,
    toBlock: "latest",
    address: contractAddress,
    topics: [newLeafEvent]
  };
  const res = await jsonrpc('eth_getLogs', [params]);
  const logs = res.result;

  const contractInterface = new ethers.utils.Interface(shieldContract.abi);

  for (let i = 0; i < logs.length; i++) {
    const txLogs = contractInterface.parseLog(logs[i]);
    const leafIndex = txLogs.args[0].toNumber();
    const leafValue = txLogs.args[1];
    logger.info(`Found previously missed leaf index ${leafIndex} of value ${leafValue}`);

    const leaf = {
      hash: leafValue,
      leafIndex: leafIndex,
      txHash: logs[i].transactionHash,
      blockNumber: logs[i].blockNumber
    }
    await insertLeaf(contractAddress, leaf);
  }
}

export const jsonrpc = async (method, params, id) => {
  const response = await axios.post(process.env.ETH_CLIENT_HTTP, {
    jsonrpc: "2.0",
    id: id || 1,
    method: method,
    params: params
  });
  return response.data;
}
