import { ethers, Contract } from 'ethers';
import { readFile } from 'fs/promises';

export class EthereumService {
  private ccsmContract: Contract;

  constructor() {
    this.connectToCcsm();
  }

  private async connectToCcsm() {
    // If you don't specify a //url//, Ethers connects to the default
    // (i.e. ``http:/\/localhost:8545``) Specify georli url here
    const ccsmProvider = new ethers.providers.JsonRpcProvider(
      process.env.CCSM_PROVIDER_URL,
    );

    const ccsmContractAddress = await this.getDeployedCcsmContractAddress();
    const ccsmContractAbi = await this.getDeployedCcsmContractAbi();

    this.ccsmContract = new ethers.Contract(
      ccsmContractAddress,
      ccsmContractAbi,
      ccsmProvider,
    );
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
    return JSON.parse((await readFile('./ccsmContractAddress.json')).toString())
      .contractAddress;
  }

  private async getDeployedCcsmContractAbi(): Promise<any> {
    return JSON.parse(
      (
        await readFile(
          './artifacts/src/bri/zeroKnowledgeProof/services/blockchain/ethereum/contracts/Ccsm.sol/Ccsm.json',
        )
      ).toString(),
    ).abi;
  }
}
