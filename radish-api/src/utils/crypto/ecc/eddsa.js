import fs from 'fs';
import { Wallet } from 'ethers';

const EdDSA = require('elliptic').eddsa;

const walletPath = '/keystore/account.eth'; // DO NOT USE - NOT REQUIRED.

// DO NOT USE - NOT REQUIRED.
export const getPrivateKey = () => {
  if (fs.existsSync(walletPath)) {
    const wallet = fs.readFileSync(walletPath);
    return JSON.parse(wallet).signingKey.privateKey;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletPath, JSON.stringify(wallet));
  return wallet.signingKey.privateKey;
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
