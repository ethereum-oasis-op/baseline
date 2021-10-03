require('dotenv').config()
const { ethers } = require('@nomiclabs/hardhat-ethers')

const networks = ['mainnet', 'rinkeby', 'kovan', 'arbitrum-rinkeby']
const accounts = {
  mnemonic: process.env.MNEMONIC,
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 2
}

/**
 * Create Hardhat network object
 * @param {string} network - name of the network as it appears in infura url
 * @return {Object} - the hardhat network object
 */
const makeNetwork = (network) => {
  return {
    url: `https://${network}.infura.io/v3/${process.env.INFURA}`,
    accounts
  }
}

module.exports = {
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: networks.reduce((obj, entry) => {
    obj[entry] = makeNetwork(entry)
    return obj
  }, {})
}
