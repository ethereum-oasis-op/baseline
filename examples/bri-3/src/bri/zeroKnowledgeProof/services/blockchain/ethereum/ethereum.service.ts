import { ethers } from 'hardhat';
import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { IBlockchainService } from '../blockchain.interface';

@Injectable()
export class EthereumService implements IBlockchainService {
  public async deployContract(contractName: string) {
    const ccsmContract = await ethers.getContractFactory(contractName);
    const deployedCcsmContract = await ccsmContract.deploy();
    await this.storeDeployedContractAddress(deployedCcsmContract.address);
  }

  public async storeAnchorHash(contractName: string, anchorHash: string) {
    const ccsmContract = await this.connectToContract(contractName);
    await ccsmContract.setAnchorHash(anchorHash);
  }

  private async connectToContract(contractName: string) {
    const ccsmContractAddress = await this.getDeployedContractAddress();
    return await ethers.getContractAt(contractName, ccsmContractAddress);
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
