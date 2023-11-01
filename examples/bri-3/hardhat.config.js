/** @type import('hardhat/config').HardhatUserConfig */

require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-toolbox');
require('dotenv/config');
module.exports = {
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
  solidity: '0.8.19',
  paths: {
    sources:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/contracts',
    artifacts:
      './zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/artifacts',
  },
};
