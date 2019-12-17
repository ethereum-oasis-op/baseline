// eslint-disable-next-line prefer-destructuring
const utils = require('ethers').ethers.utils;
const Wallet = require('./wallet');
const Ethers = require('./ethers');
const Contract = require('./contract');
const Paths = require('../paths.json');

const assignManager = async (fromAddress, toAddress) => {
  const OrgRegistryMetadata = Ethers.getContractMetadata(Paths.OrgRegistryPath);

  const tx = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    Contract.getOrgRegistryAddress(),
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey('buyer'),
  ).assignManager(fromAddress, toAddress);
  const transactionHash = { transactionHash: tx.hash };

  return transactionHash;
};

const setInterfaceImplementer = async (managerAddress, interfaceHash, implementerAddress) => {
  const ERC1820Metadata = await Ethers.getContractMetadata(Paths.ERC1820RegistryPath);
  const tx = await Ethers.getContractWithWallet(
    ERC1820Metadata,
    Contract.getERC1820Address(),
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey('buyer'),
  ).setInterfaceImplementer(managerAddress, interfaceHash, implementerAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

const registerToOrgRegistry = async (
  entityName,
  orgRegistryAddress,
  accountAddress,
  name,
  role,
  key,
) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistryPath);
  const tx = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(entityName),
  ).registerOrg(accountAddress, utils.formatBytes32String(name), role, utils.hexlify(key));
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

const getOrgCount = async orgRegistryAddress => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistryPath);
  const contract = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey('buyer'),
  );

  const hexCount = await contract.getOrgCount();
  const { _hex: count } = Ethers.parseBigNumbers(hexCount);
  return count;
};

const getOrgInfo = async (orgRegistryAddress, orgAddress) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistryPath);
  const contract = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey('buyer'),
  );

  const result = await contract.getOrg(orgAddress);
  const [address, name, role, messagingKey] = result;
  return {
    address,
    name: utils.parseBytes32String(name),
    role: parseInt(role, 16),
    messagingKey,
  };
};

module.exports = {
  assignManager,
  setInterfaceImplementer,
  registerToOrgRegistry,
  getOrgCount,
  getOrgInfo,
};
