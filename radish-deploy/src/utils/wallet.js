const fs = require('fs');
const { Wallet } = require('ethers');

const absoluteFilepath = '/app/src/config/keystore';

const getWalletPath = role => `${absoluteFilepath}/${role}.eth`;

const getWallet = role => {
  const walletFilePath = getWalletPath(role);
  console.log(`📁  Loading ${role} wallet :`, walletFilePath);
  if (fs.existsSync(walletFilePath)) {
    const wallet = fs.readFileSync(walletFilePath);
    return JSON.parse(wallet);
  }
  console.log('No wallet found:', walletFilePath);
  return process.exit(1);
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
  getPrivateKey,
};
