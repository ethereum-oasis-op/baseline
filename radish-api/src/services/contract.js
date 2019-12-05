import { getServerSettings, setOrganizationRegistryAddress } from '../utils/serverSettings';
import db from '../db';
import { getPrivateKey } from '../utils/wallet';
import { getProvider, getWallet, deployContract } from '../utils/ethers';

// eslint-disable-next-line
const ERC1820RegistryJson = require('/app/artifacts/ERC1820Registry.json');
// eslint-disable-next-line
const RegistrarJson = require('/app/artifacts/Registrar.json');
// eslint-disable-next-line
const OrgRegistryJson = require('/app/artifacts/OrgRegistry.json');

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
  const returnData = await deployContract(ERC1820RegistryJson, uri, privateKey, null);
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
  const returnData = await deployContract(RegistrarJson, uri, privateKey, addressOfERC1820);
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: config.registrarNameInDB,
    contractOwner: wallet.signingKey.address,
    contractAddress: returnData.address,
    transactionHash: returnData.hash,
  };
  await saveSmartContract(inputWithContractAddress);
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
  const returnData = await deployContract(OrgRegistryJson, uri, privateKey, addressOfRegistrar);
  const pendingRecord = {
    transactionHash: returnData.hash,
    status: 'pending',
  };
  await saveBlockchainTransaction(pendingRecord);
  const inputWithContractAddress = {
    contractName: config.orgRegistryNameInDB,
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
};
