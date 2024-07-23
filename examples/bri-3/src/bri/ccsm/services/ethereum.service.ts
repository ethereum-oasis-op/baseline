import { Injectable, InternalServerErrorException } from '@nestjs/common';
import 'dotenv/config';
import {
  BaseWallet,
  Contract,
  ethers,
  InfuraProvider,
  JsonRpcProvider,
  Provider,
  SigningKey,
} from 'ethers';
import * as CcsmBpiStateAnchor from '../../../../ccsmArtifacts/contracts/CcsmBpiStateAnchor.sol/CcsmBpiStateAnchor.json';
import { internalBpiSubjectEcdsaPrivateKey } from '../../../shared/testing/constants';
import { ICcsmService } from './ccsm.interface';

@Injectable()
export class EthereumService implements ICcsmService {
  private provider: Provider;
  private wallet: BaseWallet;

  constructor() {
    const network = process.env.CCSM_NETWORK;

    if (network === 'localhost') {
      this.provider = new JsonRpcProvider('http://localhost:8545');
    } else {
      this.provider = new InfuraProvider(
        network,
        process.env.INFURA_PROVIDER_API_KEY,
      );
    }

    const signingKey = new SigningKey(internalBpiSubjectEcdsaPrivateKey);
    this.wallet = new BaseWallet(signingKey, this.provider);
  }

  async connectToContract(): Promise<Contract> {
    const ccsmContractAddress =
      process.env.CCSM_BPI_STATE_ANCHOR_CONTRACT_ADDRESS!;

    const ccsmBpiStateAnchorContract = new ethers.Contract(
      ccsmContractAddress,
      CcsmBpiStateAnchor.abi,
      this.wallet,
    );

    return ccsmBpiStateAnchorContract;
  }

  public async storeAnchorHash(
    workstepInstanceId: string,
    anchorHash: string,
  ): Promise<void> {
    const ccsmContract = await this.connectToContract();
    try {
      const tx = await ccsmContract.setAnchorHash(
        workstepInstanceId,
        anchorHash,
      );
      await tx.wait();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while trying to process ethereum tx : ${error}`,
      );
    }
  }

  public async getAnchorHash(workstepInstanceId: string): Promise<string> {
    const ccsmContract = await this.connectToContract();
    const anchorHash = await ccsmContract.getAnchorHash(workstepInstanceId);
    return anchorHash;
  }
}
