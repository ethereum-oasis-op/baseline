import fs from 'fs';
import { Wallet, utils } from 'ethers';
import { getProvider } from './ethers';

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
    console.log(`Existing wallet found with ${existingWallet.signingKey.address}!
    Aborting creation of wallet for saftey reasons.
    Remove the file yourself and try again.`);
    return false;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  console.log(`Created a new wallet stored at ${walletPath}`);
  return true;
};

export const createWalletFromMnemonic = async (mnemonic, path = 'm/1') => {
  const existingWallet = await getWallet();
  if (existingWallet) {
    console.log(`Existing wallet found with ${existingWallet.signingKey.address}!
    Aborting creation of wallet for saftey reasons.
    Remove the file yourself and try again.`);
    return false;
  }
  const wallet = Wallet.fromMnemonic(mnemonic, path);

  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  console.log(`New wallet created with mnemonic with address ${wallet.signingKey.address}...`);
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
