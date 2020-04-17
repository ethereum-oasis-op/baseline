// eslint-disable-next-line prefer-destructuring
const utils = require('ethers').ethers.utils;
const Wallet = require('./wallet');
const Ethers = require('./ethers');
const Contract = require('./contract');
const Paths = require('../paths.json');

/**
@param {string} manageeName Name of the contract for which we wish to set the new manager.
@param {string} newManagerName Name of the new manager we wish to assign.
@param {string} msgSenderName Name of the person invoking the 'assignManager' function (not necessarily the same as the newManager).
*/
const assignManager = async (managerName, msgSenderName) => {
  // we'll be calling the 'assignManager' method of OrgRegistry.sol:
  const OrgRegistryMetadata = Ethers.getContractMetadata(Paths.OrgRegistry);

  // TODO: it appears the assignManager function can only be called once before being uncallable. If called again, the eventual call of ERC1820Registry's 'setManager' function would fail, because msg.sender would always be OrgRegistry's address, and not the current Manager.
  const contractWithWallet = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    Contract.getContractAddress('OrgRegistry'),
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  );

  // the 'old manager' of OrgRegistry is the OrgRegistry itself.
  const managerAddress = Contract.getContractAddress(managerName);

  const tx = await contractWithWallet.assignManager(managerAddress);
  const transactionHash = {
    transactionHash: tx.hash
  };

  return transactionHash;
};

const setInterfaceImplementer = async (
  managerAddress,
  interfaceHash,
  implementerAddress,
  msgSenderName,
) => {
  const ERC1820Metadata = await Ethers.getContractMetadata(Paths.ERC1820Registry);
  const tx = await Ethers.getContractWithWallet(
    ERC1820Metadata,
    Contract.getContractAddress('ERC1820Registry'),
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  ).setInterfaceImplementer(managerAddress, interfaceHash, implementerAddress);
  const transactionHash = {
    transactionHash: tx.hash
  };
  return transactionHash;
};

const registerOrgInterfaces = async (
  msgSenderName,
  orgRegistryAddress,
  groupName,
  tokenFactoryAddress,
  shieldAddress,
  verifierAddress,
) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistry);
  const tx = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  ).registerInterfaces(
    utils.formatBytes32String(groupName),
    tokenFactoryAddress,
    shieldAddress,
    verifierAddress,
  );
  const transactionHash = {
    transactionHash: tx.hash
  };
  return transactionHash;
}

const registerToOrgRegistry = async (
  msgSenderName,
  orgRegistryAddress,
  accountAddress,
  name,
  role,
  messagingKey,
  zkpPublicKey,
) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistry);
  // we'll be calling the 'assignManager' method of OrgRegistry.sol:
  // TODO: setInterfaceImplementer function can only be called once before being uncallable. If called again, the eventual call of ERC1820Registry's 'setManager' function would fail, because msg.sender would always be OrgRegistry's address, and not the current Manager.
  /* let contractMetadata; 
    switch (manageeName) {
    case 'OrgRegistry':
      contractMetadata = Ethers.getContractMetadata(Paths.OrgRegistry);
      break;
    case 'Shield':
      contractMetadata = Ethers.getContractMetadata(Paths.Shield);
      break;
    case 'Verifier':
      contractMetadata = Ethers.getContractMetadata(Paths.Verifier);
    default:
      break;
  } */
  const tx = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  ).registerOrg(
    accountAddress,
    utils.formatBytes32String(name),
    role,
    utils.hexlify(messagingKey),
    utils.hexlify(zkpPublicKey),
  );
  const transactionHash = {
    transactionHash: tx.hash
  };
  return transactionHash;
};

const getOrgCount = async (orgRegistryAddress, msgSenderName) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistry);
  const contract = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  );

  const hexCount = await contract.getOrgCount();
  const {
    _hex: count
  } = Ethers.parseBigNumbers(hexCount);
  return count;
};

const getOrgInfo = async (orgRegistryAddress, orgAddress, msgSenderName) => {
  const OrgRegistryMetadata = await Ethers.getContractMetadata(Paths.OrgRegistry);
  const contract = await Ethers.getContractWithWallet(
    OrgRegistryMetadata,
    orgRegistryAddress,
    process.env.RPC_PROVIDER,
    Wallet.getPrivateKey(msgSenderName),
  );

  const result = await contract.getOrg(orgAddress);
  const [address, name, role, messagingKey, zkpPublicKey] = result;
  return {
    address,
    name: utils.parseBytes32String(name),
    role: parseInt(role, 16),
    messagingKey,
    zkpPublicKey,
  };
};

module.exports = {
  assignManager,
  setInterfaceImplementer,
  registerToOrgRegistry,
  registerOrgInterfaces,
  getOrgCount,
  getOrgInfo,
};