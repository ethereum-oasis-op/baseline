/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('dotenv/config');
module.exports = {
  solidity: '0.8.20',
  defaultNetwork: process.env.CCSM_NETWORK,
  networks: {
    //Uncomment the required network
    // goerli: {
    //   url: `${process.env.ALCHEMY_URL}`,
    //   accounts: [`0x${process.env.ALCHEMY_GOERLI_PRIVATE_KEY}`],
    // },
    // ganache: {
    //   url: `${process.env.GANACHE_URL}`,
    //   accounts: [`0x${process.env.GANACHE_ACCOUNT_PRIVATE_KEY}`],
    // },
  },
  paths: {
    sources: './src/bri/ccsm/contracts',
    tests: './src/bri/ccsm/test',
    artifacts:
      './zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/artifacts',
  },
};
