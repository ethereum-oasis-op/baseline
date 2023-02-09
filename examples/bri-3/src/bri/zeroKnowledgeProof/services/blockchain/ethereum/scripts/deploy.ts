import { ethers } from 'hardhat';
import * as fs from 'fs';

async function deployCcsmContract() {
  const Ccsm = await ethers.getContractFactory('Ccsm');
  const ccsm = await Ccsm.deploy();

  await ccsm.deployed();

  console.log(
    `The contract has been deployed to ${ccsm.address} on the ${ccsm.provider}`,
  );
  await storeDeployedCcsmContractAddress(ccsm.address);
}

async function storeDeployedCcsmContractAddress(contractAddress: string) {
  const ccsmAddress = JSON.stringify({
    contractAddress: contractAddress,
  });

  console.log(ccsmAddress);

  fs.writeFile(
    './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/ccsmContractAddress.json',
    ccsmAddress,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    },
  );
}

deployCcsmContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
