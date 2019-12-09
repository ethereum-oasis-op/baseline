import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import {
  getWallet,
  getContractWithWallet,
  getContract,
  parseBytes32ToStringArray,
  parseBigNumbersToIntArray,
} from '../utils/ethers';
import { getERC1820RegistryJson, getRegistarJson, getOrgRegistryJson } from './contract';

export const assignManager = async fromAddress => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(config.blockchainProvider, privateKey);
  const walletAddress = wallet.signingKey.address;

  const tx = await getContractWithWallet(
    getOrgRegistryJson(),
    config.organizationRegistryAddress,
    config.blockchainProvider,
    privateKey,
  ).assignManager(fromAddress, walletAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const setInterfaceImplementer = async (
  managerAddress,
  interfaceHash,
  implementerAddress,
) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getERC1820RegistryJson(),
    config.erc1820RegistryAddress,
    config.blockchainProvider,
    privateKey,
  ).setInterfaceImplementer(managerAddress, interfaceHash, implementerAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const registerToOrgRegistry = async (address, name, role, key) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const tx = await getContractWithWallet(
    getOrgRegistryJson(),
    config.organizationRegistryAddress,
    config.blockchainProvider,
    privateKey,
  ).registerOrg(address, utils.formatBytes32String(name), role, utils.hexlify(key));
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getOrganizationCount = async () => {
  const config = await getServerSettings();
  const organizationCount = await getContract(
    getOrgRegistryJson(),
    config.blockchainProvider,
    config.organizationRegistryAddress,
  ).getOrgCount();
  return organizationCount.toNumber();
};

export const listOrganizations = async (start, count) => {
  const config = await getServerSettings();
  const organizationList = await getContract(
    getOrgRegistryJson(),
    config.blockchainProvider,
    config.organizationRegistryAddress,
  ).getOrgs(start, count);
  return {
    addresses: organizationList[0],
    names: parseBytes32ToStringArray(organizationList[1]),
    roles: parseBigNumbersToIntArray(organizationList[2]),
    keys: organizationList[3],
  };
};

export const getRegisteredOrganization = async walletAddress => {
  const config = await getServerSettings();
  const organization = await getContract(
    getOrgRegistryJson(),
    config.blockchainProvider,
    config.organizationRegistryAddress,
  ).getOrg(walletAddress);
  return {
    address: organization[0],
    name: utils.parseBytes32String(organization[1]),
    role: organization[2].toNumber(),
    key: organization[3],
  };
};

export const getInterfaceAddress = async (registrarAddress, managerAddress, interfaceName) => {
  const config = await getServerSettings();
  const interfaceAddress = await getContract(
    getRegistarJson(),
    config.blockchainProvider,
    registrarAddress,
  ).interfaceAddr(managerAddress, interfaceName);

  return interfaceAddress;
};

export default {
  registerToOrgRegistry,
  listOrganizations,
  assignManager,
  setInterfaceImplementer,
  getInterfaceAddress,
  getRegisteredOrganization,
  getOrganizationCount,
};
