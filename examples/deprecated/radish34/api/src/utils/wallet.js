import fs from 'fs';
import { Wallet, utils } from 'ethers';
import { getProvider } from './ethers';
import { logger } from 'radish34-logger';

const walletPath = '/keystore/account.eth';

export const getWallet = async () => {
  if (fs.existsSync(walletPath)) {
    const data = fs.readFileSync(walletPath);
    const wallet = JSON.parse(data);
    return wallet;
  }
  return false;
};

export const createWallet = () => {
  const existingWallet = getWallet();
  if (existingWallet) {
    logger.info(`Existing wallet found with ${existingWallet.signingKey.address}!
    Aborting creation of wallet for saftey reasons.
    Remove the file yourself and try again.`, { service: 'API'});
    return false;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  logger.info(`Created a new wallet stored at ${walletPath}.`, { service: 'API'});
  return true;
};

export const createWalletFromMnemonic = async (mnemonic, path = 'm/1') => {
  const existingWallet = await getWallet();
  if (existingWallet) {
    logger.info(`Existing wallet found with ${existingWallet.signingKey.address}!
    Aborting creation of wallet for saftey reasons.
    Remove the file yourself and try again.`, { service: 'API'});
    return false;
  }
  const wallet = Wallet.fromMnemonic(mnemonic, path);

  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  logger.info(`New wallet created with mnemonic with address ${wallet.signingKey.address}.`, { service: 'API'});
  return true;
};

export const getPrivateKey = () => {
  if (fs.existsSync(walletPath)) {
    const wallet = fs.readFileSync(walletPath);
    return JSON.parse(wallet).signingKey.privateKey;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  return wallet.signingKey.privateKey;
};

export const getBalance = async () => {
  const wallet = await getWallet();
  const provider = getProvider();
  const balance = await provider.getBalance(wallet.signingKey.address);
  const balanceInEther = utils.formatEther(balance.toString());
  return balanceInEther;
};

export default {
  getWallet,
  getPrivateKey,
  getBalance,
  createWalletFromMnemonic,
};
