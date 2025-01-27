import { ethers, Wallet } from "ethers";
//import dotenv from "dotenv";
import axios from "axios";
import { commitMgrUrl } from "../components/Forms/FormSettings.js";
import shieldContract from "./Shield.json";
import verifierContract from "./VerifierNoop.json";

//dotenv.config();

//console.log('commitMgrUrl =', commitMgrUrl)
console.log('priv =', process.env.WALLET_PRIVATE_KEY)
//export const web3provider = new ethers.providers.JsonRpcProvider(`${commitMgrUrl}/jsonrpc`);
//console.log('web3provider =', web3provider)
//export const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const deployVerifier = async () => {
  let error, res;
  const senderAddress = process.env.WALLET_PUBLIC_KEY;
  console.log('public key:', senderAddress)
  const web3provider = new ethers.providers.JsonRpcProvider(`${commitMgrUrl}/jsonrpc`);
  console.log('private key:', process.env.WALLET_PRIVATE_KEY)
  const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);
  const nonce = await wallet.getTransactionCount();
  //res = await axios.post(`${commitMgrUrl}/jsonrpc`, {
    //jsonrpc: "2.0",
    //method: "eth_getTransactionCount",
    //params: [senderAddress, "latest"],
    //id: 1,
  //});


  //const nonce = res.data.result;
  console.log('nonce:', nonce)
  const unsignedTx = {
    from: senderAddress,
    data: verifierContract.bytecode,
    nonce
  };

  res = await axios.post(`${commitMgrUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_estimateGas",
    params: [unsignedTx],
    id: 1,
  });

  const gasEstimate = res.data.result;
  console.log('gasEstimate:', gasEstimate)
  //const gasEstimate = await wallet.estimateGas(unsignedTx);
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  txHash = tx.hash;
  if (!txHash) {
    error = "Deploy Verifier contract failed"
    return { error }
  }

  res = await axios.post(`${commitMgrUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "eth_getTransactionReceipt",
    params: [txHash],
    id: 1,
  });
  const txDetails = res.data.result;
  const verifierAddress = txDetails.contractAddress;

  return { result: verifierAddress, error }
}

export const deployShield = async (verifierAddress, treeHeight = 4) => {
  let error;
  const senderAddress = process.env.WALLET_PUBLIC_KEY;
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
  unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

  const tx = await wallet.sendTransaction(unsignedTx);
  await tx.wait();
  const txHash = tx.hash;
  if (!txHash) {
    error = "Deploy Verifier contract failed"
    return { error }
  }

  const res = await axios.post(`${commitMgrUrl}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
    });
  const txDetails = res.body.result;
  const shieldAddress = txDetails.contractAddress;
  
  return { result: shieldAddress, error }
}

export const trackShield = async () => {
  const res = await axios.post(`${commitMgrUrl}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "baseline_track",
    params: [counterpartyShieldAddress],
    id: 1,
  });
  const { result, error } = res.body.result;
  return { result, error }
}
