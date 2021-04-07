import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import shieldContract from "./Shield.json";
import verifierContract from "./VerifierNoop.json";
import { logger } from "../logger";

dotenv.config();
    
const senderAddress = process.env.WALLET_PUBLIC_KEY;
const web3provider = new ethers.providers.JsonRpcProvider(`${process.env.COMMIT_MGR_URL}/jsonrpc`);
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);

export const deployVerifier = async () => {
  let error
  let res;

  res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_getTransactionCount",
    params: [senderAddress, "latest"],
    id: 1,
  });
  
  const nonce = res.data.result;
  logger.info(`nonce: ${nonce}`)
  const unsignedTx = {
    from: senderAddress,
    data: verifierContract.bytecode,
    nonce
  };
  
  res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_estimateGas",
    params: [unsignedTx],
    id: 1,
  });
  
  const gasEstimate = res.data.result;
  logger.info(`gasEstimate: ${gasEstimate}`)
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
  
  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  const txHash = tx.hash;
  if (!txHash) {
    error = "Deploy Verifier contract failed"
    return { error }
  }

  res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_getTransactionReceipt",
    params: [txHash],
    id: 1,
  });
  const txDetails = res.data.result;
  const verifierAddress = txDetails.contractAddress;
  logger.info(`SUCCESS! Verifier contract address is ${verifierAddress}`)
  
  return { result: verifierAddress, error }
}
  
export const deployShield = async (verifierAddress, treeHeight = 4) => {
  let error;
  const nonce = await wallet.getTransactionCount();
  const abiCoder = new ethers.utils.AbiCoder();
  // Encode the constructor parameters, then append to bytecode
  const encodedParams = abiCoder.encode(["address", "uint"], [verifierAddress, treeHeight]);
  const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();
  const unsignedTx = {
    from: senderAddress,
    data: bytecodeWithParams,
    nonce
  };
  
  const gasEstimate = await wallet.estimateGas(unsignedTx);
  logger.info(`gasEstimate: ${gasEstimate}`)
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
  
  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  const txHash = tx.hash;
  if (!txHash) {
    error = "Deploy Verifier contract failed"
    return { error }
  }
  
  const res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_getTransactionReceipt",
    params: [txHash],
    id: 1,
  });

  const txDetails = res.data.result;
  const shieldAddress = txDetails.contractAddress;
  logger.info(`SUCCESS! Shield contract address is ${shieldAddress}`)
    
  return { result: shieldAddress, error }
}
  
export const trackShield = async (shieldAddress) => {
  const res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_track",
    params: [shieldAddress],
    id: 1,
  });
  const { result, error } = res.data.result;
  logger.info(`SUCCESS! Now tracking Shield contract address ${shieldAddress}`)
  return { result, error }
}

export const createCommit = async (shieldAddress) => {
  const res = await axios.post(`${process.env.COMMIT_MGR_URL}/commits`, {
    jsonrpc: "2.0",
    method: "baseline_track",
    params: [shieldAddress],
    id: 1,
  });
  const { result, error } = res.data.result;
  logger.info(`SUCCESS! Now tracking Shield contract address ${shieldAddress}`)
  return { result, error }
}