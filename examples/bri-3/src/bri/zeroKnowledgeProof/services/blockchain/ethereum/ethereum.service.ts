import { readFile, writeFile } from 'fs/promises';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { IBlockchainService } from '../blockchain.interface';
import { Contract } from 'ethers';

@Injectable()
export class EthereumService implements IBlockchainService {
  public async deployContract(contractName: string): Promise<void> {
    throw new NotImplementedException();
    // TODO: We need to use ethers js here for connection, not hardhat ethers
    // const ccsmContract = await ethers.getContractFactory(contractName);
    // const deployedCcsmContract = await ccsmContract.deploy();
    // await this.storeDeployedContractAddress(deployedCcsmContract.address);
  }

  async connectToContract(contractName: string): Promise<Contract> {
    throw new NotImplementedException();
    // TODO: We need to use ethers js here for connection, not hardhat ethers
    // const ccsmContractAddress = await this.getDeployedContractAddress();
    // return await ethers.getContractAt(contractName, ccsmContractAddress);
  }

  public async storeAnchorHash(
    contractName: string,
    anchorHash: string,
  ): Promise<void> {
    const ccsmContract = await this.connectToContract(contractName);
    await ccsmContract.setAnchorHash(anchorHash);
  }

  private async getDeployedContractAddress(): Promise<string> {
    return JSON.parse(
      (
        await readFile(
          './zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/ccsmContractAddress.json',
        )
      ).toString(),
    ).contractAddress;
  }

  private async storeDeployedContractAddress(contractAddress: string) {
    const ccsmAddress = JSON.stringify({
      contractAddress: contractAddress,
    });

    await writeFile(
      './zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/ccsmContractAddress.json',
      ccsmAddress,
    );
  }
}
