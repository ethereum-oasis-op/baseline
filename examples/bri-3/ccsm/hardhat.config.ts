import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url:
        'https://sepolia.infura.io/v3/' + process.env.INFURA_PROVIDER_API_KEY,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [], // TODO: Add test account for sepolia
    },
  },
  paths: {
    artifacts: '../ccsmArtifacts',
  },
};

export default config;
