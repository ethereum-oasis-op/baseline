const fs = require('fs');
const { Wallet } = require('ethers');
const Paths = require('../paths.json');

const getWalletPath = role => `${Paths.Keystore}/${role}.eth`;

const getWallet = role => {
  const walletFilePath = getWalletPath(role);
  if (fs.existsSync(walletFilePath)) {
    const wallet = fs.readFileSync(walletFilePath);
    return JSON.parse(wallet);
  }
  console.log('No wallet found:', walletFilePath);
  return process.exit(1);
};

const getAddress = role => {
  const { address } = getWallet(role).signingKey;
  return address;
};

const getPrivateKey = role => {
  const walletFilePath = getWalletPath(role);
  if (fs.existsSync(walletFilePath)) {
    const wallet = fs.readFileSync(walletFilePath);
    return JSON.parse(wallet).signingKey.privateKey;
  }
  const wallet = Wallet.createRandom();
  fs.writeFileSync(walletFilePath, JSON.stringify(wallet));
  return wallet.signingKey.privateKey;
};

module.exports = {
  getWallet,
  getAddress,
  getPrivateKey,
};
