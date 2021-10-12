import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import { getProvider, getWallet } from '../utils/ethers';

export const getAddress = async () => {
  const config = await getServerSettings();
  const wallet = getWallet(config.rpcProvider, await getPrivateKey());
  return wallet.signingKey.address;
};

export const getAccounts = async () => {
  const config = await getServerSettings();
  return getProvider(config.rpcProvider).listAccounts();
};

export const getBalance = async () => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const wallet = getWallet(config.rpcProvider, privateKey);
  const balanceBN = await wallet.getBalance();
  const balance = utils.formatUnits(balanceBN, 'ether');
  return balance;
};

export default {
  getAddress,
  getAccounts,
  getBalance,
};
