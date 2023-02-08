import { ethers } from 'hardhat';
import fs from 'fs';

async function deployCcsmContract() {
  const Ccsm = await ethers.getContractFactory('Ccsm');
  const ccsm = await Ccsm.deploy();

  await ccsm.deployed();

  await storeDeployedCcsmContractAddress(ccsm.address);
}

async function storeDeployedCcsmContractAddress(contractAddress: string) {
  const ccsmAddress = JSON.stringify({
    contractAddress: contractAddress,
  });

  fs.appendFile('ccsmContractAddress.json', ccsmAddress, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    //file written successfully
  });
}

deployCcsmContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
