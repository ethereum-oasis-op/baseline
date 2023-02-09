import { ethers } from 'hardhat';
import { readFile } from 'fs/promises';

export class EthereumService {
  private ccsmContract;

  constructor() {
    this.connectToCcsmContract();
  }

  private async connectToCcsmContract() {
    const ccsmContractAddress = await this.getDeployedCcsmContractAddress();
    this.ccsmContract = ethers.getContractAt('Ccsm', ccsmContractAddress);
  }

  async storeAnchorHash(anchorHash: string) {
    await this.ccsmContract.setAnchorHash(anchorHash);
  }

  async verifyIfAnchorHashExists(anchorHash: string) {
    const anchorHashExistsOnCcsm = await this.ccsmContract.getAnchorHash(
      anchorHash,
    );
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
