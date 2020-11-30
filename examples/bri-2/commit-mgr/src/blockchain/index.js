import dotenv from "dotenv";
import axios from 'axios';
import { ethers } from 'ethers';

import { logger } from "../logger";
import { insertLeaf } from "../merkle-tree/leaves";
import { shieldContract } from "../tx-manager";
import { merkleTrees } from "../db/models/MerkleTree";

dotenv.config();

const newLeafEvent = ethers.utils.id("NewLeaf(uint256,bytes32,bytes32)");
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

export const subscribeMerkleEvents = (contractAddress) => {
  logger.info(`Creating event listeners for contract: ${contractAddress}`);

  const singleLeafFilter = {
    address: contractAddress,
    topics: [newLeafEvent]
  }

  const contractInterface = new ethers.utils.Interface(shieldContract.abi);
  const provider = get_ws_provider();
  if (!provider) {
    error = {
      code: -32603,
      message: `WEBSOCKET: could not establish connection`,
      data: `Attempted endpoint: ${process.env.ETH_CLIENT_WS}`
    };
    return error;
  }

  provider.on(singleLeafFilter, async (result) => {
    logger.info(`NewLeaf event emitted for contract: ${contractAddress}`);

    const txLogs = contractInterface.parseLog(result);
    const leafIndex = txLogs.args[0].toNumber();
    const leafValue = txLogs.args[1];
    const onchainRoot = txLogs.args[2];
    logger.info(`New on-chain root: ${onchainRoot}`);

    const leaf = {
      value: leafValue,
      leafIndex: leafIndex,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber
    }
    await insertLeaf(contractAddress, leaf);
  });
}

export const unsubscribeMerkleEvents = (contractAddress) => {
  logger.info(`Removing event listeners for contract: ${contractAddress}`);
  const singleLeafFilter = {
    address: contractAddress,
    topics: [newLeafEvent]
  }

  const provider = get_ws_provider();
  provider.off(singleLeafFilter);
}

// Re-subscribe to events for all 'active' MerkleTrees
// Meant to be called everytime this commit-mgr service is restarted
export const restartSubscriptions = async () => {
  const activeTrees = await merkleTrees.find({
    _id: { $regex: /_0$/ },
    active: true
  });

  for (let i = 0; i < activeTrees.length; i++) {
    const contractAddress = activeTrees[i]._id.slice(0, -2);
    subscribeMerkleEvents(contractAddress);
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
