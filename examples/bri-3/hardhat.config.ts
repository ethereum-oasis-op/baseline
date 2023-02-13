import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = process.env.CCSM_NETWORK
  ? {
      defaultNetwork: process.env.CCSM_NETWORK,
      networks: {
        goerli: {
          url: `${process.env.ALCHEMY_URL}`,
          accounts: [`0x${process.env.GOERLI_PRIVATE_KEY}`],
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
    }
  : {
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
