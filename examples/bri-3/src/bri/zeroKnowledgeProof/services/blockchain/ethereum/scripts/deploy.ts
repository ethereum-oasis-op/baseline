import { ethers } from 'hardhat';

async function main() {
  const Ccsm = await ethers.getContractFactory('Ccsm');
  const ccsm = await Ccsm.deploy();

  await ccsm.deployed();

  console.log(`Ccsm contact deployed to ${ccsm.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
