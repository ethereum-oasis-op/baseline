import { ethers } from 'hardhat';
import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EthereumService {
  async deployContract() {
    const ccsmContract = await ethers.getContractFactory('Ccsm');

    const deployedCcsmContract = await ccsmContract.deploy();

    await this.storeDeployedContractAddress(deployedCcsmContract.address);
  }

  async connectToContract() {
    const ccsmContractAddress = await this.getDeployedContractAddress();
    return await ethers.getContractAt('Ccsm', ccsmContractAddress);
  }

  async storeAnchorHash(anchorHash: string) {
    const ccsmContract = await this.connectToContract();
    await ccsmContract.setAnchorHash(anchorHash);
  }

  async verifyIfAnchorHashExists(anchorHash: string) {
    const ccsmContract = await this.connectToContract();
    const anchorHashExistsOnCcsm = await ccsmContract.getAnchorHash(anchorHash);
    if (anchorHashExistsOnCcsm) {
      return anchorHash;
    } else {
      return '';
    }
  }

  private async getDeployedContractAddress(): Promise<string> {
    return JSON.parse(
      (
        await readFile(
          './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/ccsmContractAddress.json',
        )
      ).toString(),
    ).contractAddress;
  }

  private async storeDeployedContractAddress(contractAddress: string) {
    const ccsmAddress = JSON.stringify({
      contractAddress: contractAddress,
    });

    await writeFile(
      './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/ccsmContractAddress.json',
      ccsmAddress,
    );
  }
}
