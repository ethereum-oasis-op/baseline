import fs from 'fs';
import { getServerSettings, setContractAddress } from '../utils/serverSettings';
import db from '../db';
import { getPrivateKey } from '../utils/wallet';
import {
  getProvider,
  getWallet,
  deployContract,
  getContract,
  getContractWithWallet,
} from '../utils/ethers';
import { logger } from 'radish34-logger';

export const getDefaultPath = contractName => {
  return `/app/artifacts/${contractName}.json`;
};

/**
@param {string} contractName - e.g. for myContract.sol, pass string 'myContract'.
*/
export const getContractJson = contractName => {
  const path = getDefaultPath(contractName);
  if (fs.existsSync(path)) {
    const json = fs.readFileSync(path);
    return JSON.parse(json);
  }
  logger.error(`Unable to locate file: ${path}.`, { service: 'API' });
  throw ReferenceError(`contractName.json not found`);
};

export const getContractById = async transactionHash => {
  const contract = await db.collection('smartcontract').findOne({ _id: transactionHash });
  return contract;
};

/**
Only works for contracts stored at the default path, and in the default place in the config (which will be most contracts).
*/
export const getContractByName = async contractName => {
  const config = await getServerSettings();
  const contract = getContract(
    getContractJson(contractName),
    config.rpcProvider,
    config.addresses[contractName],
  );
  return contract;
};

/**
Only works for contracts stored at the default path, and in the default place in the config (which will be most contracts).
*/
export const getContractWithWalletByName = async contractName => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const contract = getContractWithWallet(
    getContractJson(contractName),
    config.addresses[contractName],
    config.rpcProvider,
    privateKey,
  );
  return contract;
};

export const getAllContracts = async () => {
  const contracts = await db
    .collection('smartcontract')
    .find({})
    .toArray();
  return contracts;
};

export const getTxReceipt = async hash => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const provider = getProvider(uri);
  const txReceipt = await provider.getTransactionReceipt(hash);
  return txReceipt;
};

export const saveSmartContract = async input => {
  const smartContract = await db
    .collection('smartcontract')
    .updateOne({ _id: input.transactionHash }, { $set: input }, { upsert: true });
  return smartContract;
};

export const saveBlockchainTransaction = async input => {
  const blockchainTransaction = await db
    .collection('blockchaintransaction')
    .updateOne({ _id: input.transactionHash }, { $set: input }, { upsert: true });
  return blockchainTransaction;
};

export const deployERC1820Registry = async contractName => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(
    getContractJson('ERC1820Registry'),
    uri,
    privateKey,
    null,
  );
  const blockchainTransactionRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(blockchainTransactionRecord);
  const inputWithContractAddress = {
    contractName: contractName,
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('ERC1820Registry', returnData.address);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnData.hash).then(receipt => {
    if (receipt.status === 1) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: receipt.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnData.hash);
  return { contract };
};

export const deployRegistrar = async addressOfERC1820 => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(
    getContractJson('Registrar'),
    uri,
    privateKey,
    addressOfERC1820,
  );
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Registrar',
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('Registar', returnData.address);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnData.hash).then(receipt => {
    if (receipt.status === 1) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: receipt.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnData.hash);
  return { contract };
};

export const deployOrgRegistry = async addressOfRegistrar => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(
    getContractJson('OrgRegistry'),
    uri,
    privateKey,
    addressOfRegistrar,
  );
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Organization Registry Smart Contract',
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('OrgRegistry', returnData.address);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnData.hash).then(receipt => {
    if (receipt.status === 1) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: receipt.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnData.hash);
  return { contract };
};

export default {
  deployERC1820Registry,
  deployRegistrar,
  deployOrgRegistry,
  getContractByName,
  getContractById,
  getTxReceipt,
  getAllContracts,
  getContractJson,
};
