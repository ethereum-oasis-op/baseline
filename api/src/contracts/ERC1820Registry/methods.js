import fs from 'fs';
import { getServerSettings } from '../../db/models/baseline/server/settings';
import { getPrivateKey } from '../../wallet';
import { getContractWithWallet, getContract } from '../../utils/ethers';

const ERC1820RegistryPath = '/app/artifacts/ERC1820Registry.json';

export const getERC1820RegistryJson = () => {
  if (fs.existsSync(ERC1820RegistryPath)) {
    const erc1820Registry = fs.readFileSync(ERC1820RegistryPath);
    return JSON.parse(erc1820Registry);
  }
  console.log('Unable to locate file: ', ERC1820RegistryPath);
  throw ReferenceError('ERC1820Registry.json not found');
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

export default {
  getERC1820RegistryJson,
  setInterfaceImplementer,
  getInterfaceAddress,
};
