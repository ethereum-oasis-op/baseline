import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import {
  getContractWithWallet,
  getContract,
  parseBytes32ToStringArray,
  parseBigNumbersToIntArray,
} from '../utils/ethers';
import { getERC1820RegistryJson, getOrgRegistryJson } from './contract';
import db from '../db';

export const assignManager = async (fromAddress, toAddress) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getOrgRegistryJson(),
    config.organizationRegistryAddress,
    config.blockchainProvider,
    privateKey,
  ).assignManager(fromAddress, toAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getManager = async fromAddress => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getERC1820RegistryJson(),
    config.erc1820RegistryAddress,
    config.blockchainProvider,
    privateKey,
  ).getManager(fromAddress);
  return tx;
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
    config.rpcProvider,
    privateKey,
  ).registerOrg(address, utils.formatBytes32String(name), role, utils.hexlify(key));
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getOrganizationCount = async () => {
  const config = await getServerSettings();
  const organizationCount = await getContract(
    getOrgRegistryJson(),
    config.rpcProvider,
    config.organizationRegistryAddress,
  ).getOrgCount();
  return organizationCount.toNumber();
};

export const listOrganizations = async (start, count) => {
  const config = await getServerSettings();
  const organizationList = await getContract(
    getOrgRegistryJson(),
    config.rpcProvider,
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
    config.rpcProvider,
    config.organizationRegistryAddress,
  ).getOrg(walletAddress);
  return {
    address: organization[0],
    name: utils.parseBytes32String(organization[1]),
    role: organization[2].toNumber(),
    key: organization[3],
  };
};

export const getInterfaceAddress = async (
  globalRegistrarAddress,
  managerAddress,
  interfaceName,
) => {
  const config = await getServerSettings();
  const interfaceAddress = await getContract(
    getERC1820RegistryJson(),
    config.rpcProvider,
    config.globalRegistryAddress,
  ).getInterfaceImplementer(managerAddress, interfaceName);

  return interfaceAddress;
};

export const saveOrganization = async input => {
  const organization = await db
    .collection('organization')
    .updateOne({ _id: input.address }, { $set: input }, { upsert: true });
  return organization;
};

export const saveOrganizations = async () => {
  const orgCount = await getOrganizationCount();
  for (let i = 0; i < orgCount; i += 1) {
    const org = await listOrganizations(i, 1);
    const record = {
      address: org.addresses[0],
      name: org.names[0],
      role: org.roles[0],
      key: org.keys[0],
    };
    saveOrganization(record);
  }
};

export default {
  registerToOrgRegistry,
  listOrganizations,
  assignManager,
  setInterfaceImplementer,
  getInterfaceAddress,
  getRegisteredOrganization,
  getOrganizationCount,
  saveOrganization,
  saveOrganizations,
};
