import { ethers } from 'hardhat';
import { readFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EthereumService {
  private async connectToCcsmContract() {
    const ccsmContractAddress = await this.getDeployedCcsmContractAddress();
    return await ethers.getContractAt('Ccsm', ccsmContractAddress);
  }

  async storeAnchorHash(anchorHash: string) {
    const ccsmContract = await this.connectToCcsmContract();
    await ccsmContract.setAnchorHash(anchorHash);
  }

  async verifyIfAnchorHashExists(anchorHash: string) {
    const ccsmContract = await this.connectToCcsmContract();
    const anchorHashExistsOnCcsm = await ccsmContract.getAnchorHash(anchorHash);
    if (anchorHashExistsOnCcsm) {
      return anchorHash;
    } else {
      return '';
    }
  }

  private async getDeployedCcsmContractAddress(): Promise<string> {
    return JSON.parse(
      (
        await readFile(
          './src/bri/zeroKnowledgeProof/services/blockchain/ethereum/artifacts/ccsmContractAddress.json',
        )
      ).toString(),
    ).contractAddress;
  }
}
