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
import { Witness } from 'src/bri/zeroKnowledgeProof/models/witness';
import * as CcsmBpiStateAnchor from '../../../../ccsmArtifacts/contracts/CcsmBpiStateAnchor.sol/CcsmBpiStateAnchor.json';
import * as Workstep1Verifier from '../../../../zeroKnowledgeArtifacts/circuits/workstep1/workstep1Verifier.sol/Workstep1Verifier.json';
import { internalBpiSubjectEcdsaPrivateKey } from '../../../shared/testing/constants';
import { ICcsmService } from './ccsm.interface';

@Injectable()
export class EthereumService implements ICcsmService {
  private provider: Provider;
  private wallet: BaseWallet;

  constructor() {
    const network = process.env.CCSM_NETWORK;

    if (network === 'localhost') {
      this.provider = new JsonRpcProvider('http://127.0.0.1:8545');
    } else {
      this.provider = new InfuraProvider(
        network,
        process.env.INFURA_PROVIDER_API_KEY,
      );
    }

    const signingKey = new SigningKey(internalBpiSubjectEcdsaPrivateKey);
    this.wallet = new BaseWallet(signingKey, this.provider);
  }

  public async storeAnchorHash(
    workstepInstanceId: string,
    anchorHash: string,
  ): Promise<void> {
    const ccsmContract = await this.connectToCcsmBpiStateAnchorContract();
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
    const ccsmContract = await this.connectToCcsmBpiStateAnchorContract();
    const anchorHash = await ccsmContract.getAnchorHash(workstepInstanceId);
    return anchorHash;
  }

  public async verifyProof(verifierAddress: string, witness: Witness): Promise<boolean> {
    const verifierContract = new ethers.Contract(
      verifierAddress,
      Workstep1Verifier.abi,
      this.wallet,
    );

    // Helper function to pad and concatenate values
    const padAndConcat = (value: string | string[]) => {
      if (Array.isArray(value)) {
        return value.slice(0, 2).map(v => ethers.zeroPadValue(ethers.toBigInt(v).toString(16), 32).slice(2)).join('');
      }
      return ethers.zeroPadValue(ethers.toBigInt(value).toString(16), 32).slice(2);
      
    };

    const proofHex = "0x" + 
      padAndConcat(witness.proof.value["A"]) +
      padAndConcat(witness.proof.value["B"]) +
      padAndConcat(witness.proof.value["C"]) +
      padAndConcat(witness.proof.value["Z"]) +
      padAndConcat(witness.proof.value["T1"]) +
      padAndConcat(witness.proof.value["T2"]) +
      padAndConcat(witness.proof.value["T3"]) +
      padAndConcat(witness.proof.value["Wxi"]) +
      padAndConcat(witness.proof.value["Wxiw"]) +
      padAndConcat(witness.proof.value["eval_a"]) +
      padAndConcat(witness.proof.value["eval_b"]) +
      padAndConcat(witness.proof.value["eval_c"]) +
      padAndConcat(witness.proof.value["eval_s1"]) +
      padAndConcat(witness.proof.value["eval_s2"]) +
      padAndConcat(witness.proof.value["eval_zw"]) +
      padAndConcat(witness.proof.value["eval_r"]);

    const pubInputs = witness.publicInputs!.map(input => ethers.toBigInt(input));

    return await verifierContract.verifyProof(proofHex, pubInputs);
  }

  private async connectToCcsmBpiStateAnchorContract(): Promise<Contract> {
    const ccsmContractAddress =
      process.env.CCSM_BPI_STATE_ANCHOR_CONTRACT_ADDRESS!;

    const ccsmBpiStateAnchorContract = new ethers.Contract(
      ccsmContractAddress,
      CcsmBpiStateAnchor.abi,
      this.wallet,
    );

    return ccsmBpiStateAnchorContract;
  }
}
