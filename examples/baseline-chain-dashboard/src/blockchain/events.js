import dotenv from "dotenv";
import { ethers } from 'ethers';

import { logger } from "../logger";
import { insertLeaf } from "../merkle-tree/leaves";
import { get_ws_provider } from "./utils";
import { shieldContract } from "./shield-contract";

dotenv.config();

export const newLeafEvent = ethers.utils.id("NewLeaf(uint256,bytes32,bytes32)");

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
      hash: leafValue,
      leafIndex: leafIndex,
      txHash: result.transactionHash,
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
