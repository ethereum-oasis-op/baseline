const Wallet = require('./wallet');
const Ethers = require('./ethers');
const Paths = require('../paths.json');

let ERC1820Address;
let orgRegistryAddress;

const uri = process.env.RPC_PROVIDER;

const getERC1820Address = () => ERC1820Address;
const getOrgRegistryAddress = () => orgRegistryAddress;

const deployERC1820Registry = async () => {
  const tx = await Ethers.deployContract(
    Paths.ERC1820RegistryPath,
    uri,
    Wallet.getPrivateKey('buyer'),
    Ethers.getAccounts(uri)[0],
  );
  ERC1820Address = tx.address;
  return ERC1820Address;
};

const deployOrgRegistry = async () => {
  const tx = await Ethers.deployContract(
    Paths.OrgRegistryPath,
    uri,
    Wallet.getPrivateKey('buyer'),
    getERC1820Address(),
  );
  orgRegistryAddress = tx.address;
  return orgRegistryAddress;
};

module.exports = {
  deployERC1820Registry,
  deployOrgRegistry,
  getERC1820Address,
  getOrgRegistryAddress,
};
