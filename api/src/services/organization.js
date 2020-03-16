import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import {
  getContractWithWallet,
  getContract,
  parseBytes32ToStringArray,
  parseBigNumbersToIntArray,
} from '../utils/ethers';
import { getContractJson } from './contract';
import db from '../db';

export const assignManager = async (fromAddress, toAddress) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getContractJson('OrgRegistry'),
    config.addresses.OrgRegistry,
    config.rpcProvider,
    privateKey,
  ).assignManager(fromAddress, toAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getManager = async fromAddress => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();

  const tx = await getContractWithWallet(
    getContractJson('ERC1820Registry'),
    config.addresses.ERC1820Registry,
    config.rpcProvider,
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
    getContractJson('ERC1820Registry'),
    config.addresses.ERC1820Registry,
    config.rpcProvider,
    privateKey,
  ).setInterfaceImplementer(managerAddress, interfaceHash, implementerAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const registerToOrgRegistry = async (
  address,
  name,
  role,
  messagingKey,
  zkpPublicKey,
) => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const tx = await getContractWithWallet(
    getContractJson('OrgRegistry'),
    config.addresses.OrgRegistry,
    config.rpcProvider,
    privateKey,
  ).registerOrg(
    address,
    utils.formatBytes32String(name),
    role,
    utils.hexlify(messagingKey),
    utils.hexlify(zkpPublicKey),
  );
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const getOrganizationCount = async () => {
  const config = await getServerSettings();
  if (!config.addresses.OrgRegistry) {
    return 0;
  }
  const organizationCount = await getContract(
    getContractJson('OrgRegistry'),
    config.rpcProvider,
    config.addresses.OrgRegistry,
  ).getOrgCount();
  return organizationCount.toNumber();
};

export const listOrganizations = async () => {
  const config = await getServerSettings();
  const organizationList = await getContract(
    getContractJson('OrgRegistry'),
    config.rpcProvider,
    config.addresses.OrgRegistry,
  ).getOrgs();
  return {
    addresses: organizationList[0],
    names: parseBytes32ToStringArray(organizationList[1]),
    roles: parseBigNumbersToIntArray(organizationList[2]),
    messagingKeys: organizationList[3],
    zkpPublicKeys: organizationList[4],
  };
};

export const getRegisteredOrganization = async walletAddress => {
  const config = await getServerSettings();
  const organization = await getContract(
    getContractJson('OrgRegistry'),
    config.rpcProvider,
    config.addresses.OrgRegistry,
  ).getOrg(walletAddress);

  return {
    address: organization[0],
    name: utils.parseBytes32String(organization[1]),
    role: organization[2].toNumber(),
    messagingKey: organization[3],
    zkpPublicKey: organization[4],
  };
};

export const getInterfaceAddress = async (
  globalRegistrarAddress,
  managerAddress,
  interfaceName,
) => {
  const config = await getServerSettings();
  const interfaceAddress = await getContract(
    getContractJson('ERC1820Registry'),
    config.rpcProvider,
    config.addresses.ERC1820Registry,
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
  const { rpcProvider } = await getServerSettings();
  if (rpcProvider) {
    const orgCount = await getOrganizationCount();
    const org = await listOrganizations();
    for (let i = 0; i < orgCount; i += 1) {
      const record = {
        _id: org.addresses[i],
        address: org.addresses[i],
        name: org.names[i],
        role: org.roles[i],
        identity: org.messagingKeys[i],
        zkpPublicKey: org.zkpPublicKeys[i]
      };
      saveOrganization(record);
    }
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
