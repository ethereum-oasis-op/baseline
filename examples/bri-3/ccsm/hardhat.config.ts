import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

// TODO: add local hardhat node config
// TODO: add sepolia network config with infura or alchemy URL
// TODO: Compile the contract and add the ABI to a folder ccsmArtifacts so that it can be used by the BPI to talk to the contract

export default config;
