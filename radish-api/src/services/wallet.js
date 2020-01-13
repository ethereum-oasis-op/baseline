import { utils } from 'ethers';
import { getServerSettings } from '../utils/serverSettings';
import { getPrivateKey } from '../utils/wallet';
import { getProvider, getWallet } from '../utils/ethers';

const EdDSA = require('elliptic').eddsa;

export const getAddress = async () => {
  const config = await getServerSettings();
  const wallet = getWallet(config.blockchainProvider, await getPrivateKey());
  return wallet.signingKey.address;
};

export const getAccounts = async () => {
  const config = await getServerSettings();
  return getProvider(config.blockchainProvider).listAccounts();
};

export const getBalance = async () => {
  const config = await getServerSettings();
  const privateKey = await getPrivateKey();
  const wallet = getWallet(config.blockchainProvider, privateKey);
  const balanceBN = await wallet.getBalance();
  const balance = utils.formatUnits(balanceBN, 'ether');
  return balance;
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

export default {
  getAddress,
  getAccounts,
  getBalance,
  getPublicKey,
  sign,
  verify,
};
