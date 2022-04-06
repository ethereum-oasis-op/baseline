const { ethers, Wallet } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const commitMgrEndpoint = "http://localhost:4001/jsonrpc";

const web3provider = new ethers.providers.JsonRpcProvider(commitMgrEndpoint);
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);
const txManager = process.env.ETH_CLIENT_TYPE;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const waitRelayTx = async function (relayTxHash) {
  let mined = false
  while (!mined) {
    const statusResponse = await web3provider.send('relay_getTransactionStatus', [
      relayTxHash
    ]);

    for (let i = 0; i < statusResponse.length; i++) {
      const hashes = statusResponse[i]
      const receipt = await web3provider.getTransactionReceipt(hashes['ethTxHash'])
      if (receipt && receipt.confirmations && receipt.confirmations > 1) {
        mined = true
        return receipt
      }
    }
    await sleep(1000)
  }
}

const deposit = async function () {
  const tx = await wallet.sendTransaction({
    // This is the ITX PaymentDeposit contract address for Rinkeby
    to: '0x015C7C7A7D65bbdb117C573007219107BD7486f9',
    // Choose how much ether you want to deposit in the ITX gas tank
    value: ethers.utils.parseUnits('1.0', 'ether')
  })

  // Waiting for the transaction to be mined
  await tx.wait()
}

const getBalance = async function () {
  const balance = await web3provider.send('relay_getBalance', [wallet.address]);
  return balance;
}

module.exports = {
  getBalance,
  deposit,
  waitRelayTx,
  txManager,
  wallet,
  web3provider
}
