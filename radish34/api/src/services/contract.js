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
  console.log('Unable to locate file: ', path);
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
  const { rpcProvider, addresses: configAddresses } = config;
  const contract = getContract(
    getContractJson(contractName),
    rpcProvider,
    configAddresses[contractName],
  );
  return contract;
};

/**
Only works for contracts stored at the default path, and in the default place in the config (which will be most contracts).
*/
export const getContractWithWalletByName = async contractName => {
  const config = await getServerSettings();
  const { rpcProvider, addresses: configAddresses } = config;
  const privateKey = await getPrivateKey();
  const contract = getContractWithWallet(
    getContractJson(contractName),
    configAddresses[contractName],
    rpcProvider,
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
  const wallet = getWallet(uri, privateKey);
  const { address: walletSigningKeyAddress } = wallet.signingKey;
  const returnData = await deployContract(
    getContractJson('ERC1820Registry'),
    uri,
    privateKey,
    null,
  );
  const { hash: returnDataHash, address: returnDataAddress } = returnData;
  const blockchainTransactionRecord = {
    transactionHash: returnDataHash,
    status: 'pending',
  };
  await saveBlockchainTransaction(blockchainTransactionRecord);
  const inputWithContractAddress = {
    contractName: contractName,
    contractOwner: walletSigningKeyAddress,
    contractAddress: returnDataAddress,
    transactionHash: returnDataHash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('ERC1820Registry', returnDataAddress);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnDataHash).then(receipt => {
    if (receipt.status) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: input.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnDataHash);
  return { contract };
};

export const deployRegistrar = async addressOfERC1820 => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const privateKey = await getPrivateKey();
  const wallet = getWallet(uri, privateKey);
  const { address: walletSigningKeyAddress } = wallet.signingKey;
  const returnData = await deployContract(
    getContractJson('Registrar'),
    uri,
    privateKey,
    addressOfERC1820,
  );
  const { hash: returnDataHash, address: returnDataAddress } = returnData;
  const pendingRecord = {
    transactionHash: returnDataHash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Registrar',
    contractOwner: walletSigningKeyAddress,
    contractAddress: returnDataAddress,
    transactionHash: returnDataHash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('Registar', returnDataAddress);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnDataHash).then(receipt => {
    if (receipt) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: input.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnDataHash);
  return { contract };
};

export const deployOrgRegistry = async addressOfRegistrar => {
  const config = await getServerSettings();
  const uri = config.rpcProvider;
  const privateKey = await getPrivateKey();
  const wallet = getWallet(uri, privateKey);
  const { address: walletSigningKeyAddress } = wallet.signingKey;
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
  const { hash: returnDataHash, address: returnDataAddress } = returnData;
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: 'Organization Registry Smart Contract',
    contractOwner: walletSigningKeyAddress,
    contractAddress: returnDataAddress,
    transactionHash: returnDataHash,
  };
  await saveSmartContract(inputWithContractAddress);
  await setContractAddress('OrgRegistry', returnDataAddress);
  const provider = getProvider(uri);
  let receiptSatus;
  provider.waitForTransaction(returnData.hash).then(receipt => {
    if (receipt.status) {
      receiptSatus = 'success';
    } else {
      receiptSatus = 'failure';
    }
    const successRecord = {
      transactionHash: input.transactionHash,
      status: receiptSatus,
    };
    saveBlockchainTransaction(successRecord);
  });
  const contract = await getContractById(returnDataHash);
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
