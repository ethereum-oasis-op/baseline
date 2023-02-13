import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ganache';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
import 'hardhat-change-network';

const config: HardhatUserConfig = {
  defaultNetwork: process.env.CCSM_NETWORK,
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/bvik-_IDWOeJhYuqhc981klKE-r6IRCk',
      accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`],
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
    },
  },
  solidity: {
    version: '0.8.17',
  },
  paths: {
    sources:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/contracts',
    artifacts:
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/artifacts',
  },
};

export default config;
