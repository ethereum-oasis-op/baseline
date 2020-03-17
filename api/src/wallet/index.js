import fs from 'fs';
import { utils, Wallet } from 'ethers';
import { eddsa } from 'elliptic';
import { getServerSettings } from '../db/models/baseline/server/settings';
import { getProvider } from '../utils/ethers';

const walletPath = '/keystore/account.eth';
const EdDSA = eddsa;

export const getPrivateKey = () => {
  if (fs.existsSync(walletPath)) {
    const wallet = fs.readFileSync(walletPath);
    return JSON.parse(wallet).signingKey.privateKey;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  return wallet.signingKey.privateKey;
};

export const getWalletFromFile = () => {
  if (fs.existsSync(walletPath)) {
    const data = fs.readFileSync(walletPath);
    const wallet = JSON.parse(data);
    return wallet;
  }
  return false;
};

export const getWallet = async () => {
  return await getWalletFromFile();
};

export const getAddress = async () => {
  const config = await getServerSettings();
  const wallet = getWallet(config.blockchainProvider, await getPrivateKey());
  return wallet.signingKey.address;
};

export const getAccounts = async () => {
  const config = await getServerSettings();
  return getProvider(config.blockchainProvider).listAccounts();
};

export const getPublicKey = async () => {
  const ec = new EdDSA('ed25519');
  const privateKey = await getPrivateKey();
  const key = ec.keyFromSecret(privateKey);
  return key.getPublic('hex');
};

export const sign = async hashValue => {
  const ec = new EdDSA('ed25519');
  const privateKey = await getPrivateKey();
  const ecPrivateKey = ec.keyFromSecret(privateKey);
  return ecPrivateKey.sign(hashValue).toHex();
};

export const verify = async (publicKey, hashValue, signature) => {
  const ec = new EdDSA('ed25519');
  const ecPublicKey = ec.keyFromPublic(publicKey, 'hex');
  return ecPublicKey.verify(hashValue, signature);
};

export const getBalance = async () => {
  const wallet = await getWallet();
  const provider = getProvider();
  const balance = await provider.getBalance(wallet.signingKey.address);
  const balanceInEther = utils.formatEther(balance.toString());
  return balanceInEther;
};

export const createWallet = () => {
  const existingWallet = getWalletFromFile();
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

export const createWalletFromMnemonic = async (mnemonic, path = 'm/0') => {
  const existingWallet = await getWalletFromFile();
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

export default {
  getAddress,
  getAccounts,
  getBalance,
  getPublicKey,
  sign,
  verify,
  getWallet,
  getPrivateKey,
  createWalletFromMnemonic,
};
