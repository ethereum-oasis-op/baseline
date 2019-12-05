import db from '../db';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import { utils } from 'ethers';
import {
  getWallet,
  getContractWithWallet,
  getContract,
  parseBytes32ToStringArray,
  parseBigNumbersToIntArray,
} from '../utils/ethers';
import { getContractByName } from './contract';
// eslint-disable-next-line
const OrgRegistryJson = require('/app/artifacts/OrgRegistry.json');
// eslint-disable-next-line
const ERC1820RegistryJson = require('/app/artifacts/ERC1820Registry.json');
// eslint-disable-next-line
const RegistrarJson = require('/app/artifacts/Registrar.json');

export const assignManager = async fromAddress => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const orgRegistryName = config.orgRegistryNameInDB;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const walletAddress = wallet.signingKey.address;
  const registrySC = await getContractByName(orgRegistryName);

  const tx = await getContractWithWallet(
    OrgRegistryJson,
    registrySC.contractAddress,
    uri,
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
  const uri = config.blockchainProvider;
  const erc1820RegistryName = config.erc1820RegistryNameInDB;
  const privateKey = await getPrivateKey();
  const registrySC = await getContractByName(erc1820RegistryName);

  const tx = await getContractWithWallet(
    ERC1820RegistryJson,
    registrySC.contractAddress,
    uri,
    privateKey,
  ).setInterfaceImplementer(managerAddress, interfaceHash, implementerAddress);
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const registerToOrgRegistry = async (name, role, key) => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const orgRegistryName = config.orgRegistryNameInDB;
  const privateKey = await getPrivateKey();
  const wallet = await getWallet(uri, privateKey);
  const walletAddress = wallet.signingKey.address;
  const registrySC = await getContractByName(orgRegistryName);

  const tx = await getContractWithWallet(
    OrgRegistryJson,
    registrySC.contractAddress,
    uri,
    privateKey,
  ).registerOrg(walletAddress, utils.formatBytes32String(name), role, utils.hexlify(key));
  const transactionHash = { transactionHash: tx.hash };
  return transactionHash;
};

export const listOrganizations = async (start, count) => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const orgRegistryName = config.orgRegistryNameInDB;
  const registrySC = await db
    .collection('smartcontract')
    .findOne({ contractName: orgRegistryName });
  const organizationList = await getContract(
    OrgRegistryJson,
    uri,
    registrySC.contractAddress,
  ).getOrgs(start, count);
  return {
    addresses: organizationList[0],
    names: await parseBytes32ToStringArray(organizationList[1]),
    roles: await parseBigNumbersToIntArray(organizationList[2]),
    keys: organizationList[3],
  };
};

export const getRegisteredOrganization = async walletAddress => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const orgRegistryName = config.orgRegistryNameInDB;
  const registrySC = await db
    .collection('smartcontract')
    .findOne({ contractName: orgRegistryName });
  const organization = await getContract(OrgRegistryJson, uri, registrySC.contractAddress).getOrg(
    walletAddress,
  );
  return {
    address: organization[0],
    name: await utils.parseBytes32String(organization[1]),
    role: organization[2].toNumber(),
    key: organization[3],
  };
};

export const getInterfaceAddress = async (registrarAddress, managerAddress, interfaceName) => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const interfaceAddress = await getContract(RegistrarJson, uri, registrarAddress).interfaceAddr(
    managerAddress,
    interfaceName,
  );

  return interfaceAddress;
};

export default {
  registerToOrgRegistry,
  listOrganizations,
  assignManager,
  setInterfaceImplementer,
  getInterfaceAddress,
  getRegisteredOrganization,
};
