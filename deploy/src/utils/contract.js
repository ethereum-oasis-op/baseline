const Wallet = require('./wallet');
const Ethers = require('./ethers');
const Paths = require('../paths.json');

const uri = process.env.RPC_PROVIDER;
const contractAddresses = [];

const getContractAddress = contractName => contractAddresses[contractName];

const deployContract = async (contractName, constructorArgs = [], msgSenderName) => {
  const tx = await Ethers.deployContract(
    Paths[contractName],
    uri,
    Wallet.getPrivateKey(msgSenderName),
    constructorArgs,
  );
  contractAddresses[contractName] = tx.address;
  return contractAddresses[contractName];
};

const deployContractWithLibraryLink = async (
  contractName,
  constructorArgs = [],
  libraryName,
  msgSenderName,
) => {
  const tx = await Ethers.deployContractWithLibraryLink(
    Paths[contractName],
    uri,
    Wallet.getPrivateKey(msgSenderName),
    constructorArgs,
    libraryName,
    getContractAddress(libraryName),
  );
  contractAddresses[contractName] = tx.address;
  return contractAddresses[contractName];
};

module.exports = {
  getContractAddress,
  deployContract,
  deployContractWithLibraryLink,
};
