import { ethers } from 'hardhat';
import { writeFile } from 'fs/promises';

export async function deployCcsmContract() {
  const Ccsm = await ethers.getContractFactory('Ccsm');
  const ccsm = await Ccsm.deploy();

  await ccsm.deployed();

  await storeDeployedCcsmContractAddress(ccsm.address);
}

async function storeDeployedCcsmContractAddress(contractAddress: string) {
  const ccsmAddress = JSON.stringify({
    contractAddress: contractAddress,
  });

  await writeFile(
    './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/ccsmContractAddress.json',
    ccsmAddress,
  );
}

deployCcsmContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
