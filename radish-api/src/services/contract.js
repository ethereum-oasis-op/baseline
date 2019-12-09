import fs from 'fs';
import {
  getServerSettings,
  setERC1820RegistryAddress,
  setRegistrarAddress,
  setOrganizationRegistryAddress,
} from '../utils/serverSettings';
import db from '../db';
import { getPrivateKey } from '../utils/wallet';
import { getProvider, getWallet, deployContract } from '../utils/ethers';

const ERC1820RegistryPath = '/app/artifacts/ERC1820Registry.json';
const RegistrarPath = '/app/artifacts/Registrar.json';
const OrgRegistryPath = '/app/artifacts/OrgRegistry.json';

export const getERC1820RegistryJson = () => {
  if (fs.existsSync(ERC1820RegistryPath)) {
    const erc1820Registry = fs.readFileSync(ERC1820RegistryPath);
    return JSON.parse(erc1820Registry);
  }
  console.log('Unable to locate file: ', ERC1820RegistryPath);
  throw ReferenceError('ERC1820Registry.json not found');
};

export const getRegistarJson = () => {
  if (fs.existsSync(RegistrarPath)) {
    const registrar = fs.readFileSync(RegistrarPath);
    return JSON.parse(registrar);
  }
  console.log('Unable to locate file: ', RegistrarPath);
  throw ReferenceError('OrgRegistry.json not found');
};

export const getOrgRegistryJson = () => {
  if (fs.existsSync(OrgRegistryPath)) {
    const orgRegistry = fs.readFileSync(OrgRegistryPath);
    return JSON.parse(orgRegistry);
  }
  console.log('Unable to locate file: ', OrgRegistryPath);
  throw ReferenceError('Registrar.json not found');
};

export const getContractById = async transactionHash => {
  const contract = await db.collection('smartcontract').findOne({ _id: transactionHash });
  return contract;
};

export const getContractByName = async name => {
  const contract = await db.collection('smartcontract').findOne({ contractName: name });
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
  const uri = config.blockchainProvider;
  const provider = getProvider(uri);
  const txReceipt = await provider.getTransactionReceipt(hash);

  return {
    transactionHash: txReceipt.transactionHash,
    status: txReceipt.status,
    from: txReceipt.from,
    to: txReceipt.to,
    blockNumber: txReceipt.blockNumber,
    blockHash: txReceipt.blockHash,
    confirmations: txReceipt.confirmations,
    gasUsed: txReceipt.gasUsed.toNumber(),
    cumulativeGasUsed: txReceipt.cumulativeGasUsed.toNumber(),
    contractAddress: txReceipt.contractAddress,
  };
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
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(getERC1820RegistryJson(), uri, privateKey, null);
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
  await setERC1820RegistryAddress(returnData.address);
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
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(getRegistarJson(), uri, privateKey, addressOfERC1820);
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
  await setRegistrarAddress(returnData.address);
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
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const returnData = await deployContract(
    getOrgRegistryJson(),
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
  await setOrganizationRegistryAddress(returnData.address);
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

export const getOrganizationRegistryAddress = async () => {
  const config = await getServerSettings();
  const address = config.organizationRegistryAddress;
  return address;
};

export default {
  deployERC1820Registry,
  deployRegistrar,
  deployOrgRegistry,
  getOrganizationRegistryAddress,
  getContractByName,
  getContractById,
  getTxReceipt,
  getAllContracts,
  getERC1820RegistryJson,
  getRegistarJson,
  getOrgRegistryJson,
};
