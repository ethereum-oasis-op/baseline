import hre, { ethers } from 'hardhat';

async function main() {
  const Lock = await hre.ethers.getContractFactory('Lock');

  const provider = new hre.ethers.providers.InfuraProvider();

  const artifact = await hre.artifacts.readArtifact('Ccsm');

  const address = '';

  const contract = await hre.ethers.getContract('Ccsm');
}
