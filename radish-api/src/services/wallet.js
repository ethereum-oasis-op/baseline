import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import { getProvider, getWallet } from '../utils/ethers';

export const getAddress = async () => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = getWallet(uri, privateKey);
  return wallet.signingKey.address;
};

export const getAccounts = async () => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  return getProvider(uri).listAccounts();
};

export const getBalance = async () => {
  const config = await getServerSettings();
  const uri = config.blockchainProvider;
  const privateKey = await getPrivateKey();
  const wallet = getWallet(uri, privateKey);
  const balanceBN = await wallet.getBalance();
  const balance = utils.formatUnits(balanceBN, 'ether');
  return balance;
};

export default {
  getAddress,
  getAccounts,
  getBalance,
};
