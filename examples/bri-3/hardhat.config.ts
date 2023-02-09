/** @type import('hardhat/config').HardhatUserConfig */
import '@nomiclabs/hardhat-ganache';
import '@nomiclabs/hardhat-ethers';

module.exports = {
  default: 'ganache',
  networks: {
    ganache: {
      chainId: 1337,
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
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/artifacts',
  },
};
