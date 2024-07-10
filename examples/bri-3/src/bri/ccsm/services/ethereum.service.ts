import { readFile, writeFile } from 'fs/promises';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ICcsmService } from '../ccsm.interface';
import {
  Contract,
  ethers,
  Provider,
  AlchemyProvider,
  BaseWallet,
  SigningKey,
} from 'ethers';
import * as CcsmBpiStateAnchor from '../../../../zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/artifacts/src/bri/ccsm/contracts/CcsmBpiStateAnchor.sol/CcsmBpiStateAnchor.json';
import 'dotenv/config';
import { internalBpiSubjectEcdsaPrivateKey } from '../../../shared/testing/constants';

@Injectable()
export class EthereumService implements ICcsmService {
  private provider: Provider;
  private wallet: BaseWallet;

  constructor() {
    this.provider = new AlchemyProvider(
      process.env.ALCHEMY_PROVIDER_NETWORK,
      process.env.ALCHEMY_PROVIDER_API_KEY,
    );

    const signingKey = new SigningKey('0x' + internalBpiSubjectEcdsaPrivateKey);

    this.wallet = new BaseWallet(signingKey, this.provider);
  }

  public async deployContract(): Promise<void> {
    const ccsmBpiStateAnchorContract = new ethers.ContractFactory(
      CcsmBpiStateAnchor.abi,
      CcsmBpiStateAnchor.bytecode,
      this.wallet,
    );

    const deployingContract = await ccsmBpiStateAnchorContract.deploy([
      this.wallet.address,
    ]);
    const deployedContract = await deployingContract.waitForDeployment();

    const deployedContractAddress = await deployedContract.getAddress();
    await this.storeDeployedContractAddress(deployedContractAddress);
  }

  async connectToContract(options: { readonly: boolean }): Promise<Contract> {
    const ccsmContractAddress = await this.getDeployedContractAddress();
    let ccsmBpiStateAnchorContract;

    if (options.readonly) {
      ccsmBpiStateAnchorContract = new ethers.Contract(
        ccsmContractAddress,
        CcsmBpiStateAnchor.abi,
        this.provider,
      );
    } else {
      ccsmBpiStateAnchorContract = new ethers.Contract(
        ccsmContractAddress,
        CcsmBpiStateAnchor.abi,
        this.wallet,
      );
    }

    return ccsmBpiStateAnchorContract;
  }

  public async storeAnchorHash(
    workgroupId: string,
    anchorHash: string,
  ): Promise<void> {
    const ccsmContract = await this.connectToContract({ readonly: false });
    try {
      const tx = await ccsmContract.setAnchorHash(workgroupId, anchorHash);
      await tx.wait();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while trying to process ethereum tx : ${error}`,
      );
    }
  }

  public async getAnchorHash(workgroupdId: string): Promise<string> {
    const ccsmContract = await this.connectToContract({ readonly: true });
    const anchorHash = await ccsmContract.getAnchorHash(workgroupdId);
    return anchorHash;
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

  private async getDeployedContractAddress(): Promise<string> {
    return JSON.parse(
      (
        await readFile(
          './zeroKnowledgeArtifacts/blockchain/ethereum/artifacts/ccsmContractAddress.json',
        )
      ).toString(),
    ).contractAddress;
  }
}
