import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import {
  getContractWithWallet,
  getContract,
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
  messagingEndpoint,
  messagingKey,
  zkpPublicKey,
  metadata,
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
    utils.hexlify(messagingEndpoint),
    utils.hexlify(messagingKey),
    utils.hexlify(zkpPublicKey),
    utils.hexlify(metadata),
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
  // TODO: instead of using hard-coded addresses below, pull them from config files
  const organizations = [
    '0xB5630a5a119b0EAb4471F5f2d3632e996bf95d41',
    '0x5ACcdCCE3E60BD98Af2dc48aaf9D1E35E7EC8B5f',
    '0x3f7eB8a7d140366423e9551e9532F4bf1A304C65'
  ]

  const organizationList = await Promise.all(organizations.map(async org => {
    const onchainOrg = await getRegisteredOrganization(org);

    return {
      address: onchainOrg.address,
      name: onchainOrg.name,
      messagingEndpoint: onchainOrg.messagingEndpoint,
      messagingKey: onchainOrg.messagingKey,
      zkpPublicKey: onchainOrg.zkpPublicKey,
      metadata: onchainOrg.metadata,
    };
  }));

  return organizationList;
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
    messagingEndpoint: utils.toUtf8String(organization[2]),
    messagingKey: utils.toUtf8String(organization[3]),
    zkpPublicKey: utils.toUtf8String(organization[4]),
    metadata: utils.toUtf8String(organization[5]),
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
        _id: org[i].address,
        address: org[i].address,
        name: org[i].name,
        messagingEndpoint: org[i].messagingEndpoint,
        messagingKey: org[i].messagingKey,
        zkpPublicKey: org[i].zkpPublicKey,
        metadata: org[i].metadata,
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
