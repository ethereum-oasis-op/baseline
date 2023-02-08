/** @type import('hardhat/config').HardhatUserConfig */
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-ganache';

module.exports = {
  networks: {
    ganache: {
      chainId: 5777,
      url: 'http://127.0.0.1:7545',
    },
  },
  solidity: {
    version: '0.8.17',
  },
  paths: {
    sources:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/contracts',
    tests: './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/test',
    artifacts:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts',
    scripts:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/scripts',
  },
  mocha: {
    timeout: 40000,
  },
};
