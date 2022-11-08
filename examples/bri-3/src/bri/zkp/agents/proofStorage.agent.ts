import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { Proof } from '../models/proof';

@Injectable()
export class ProofStorageAgent {
  constructor(private storageAgent: BlockchainService) {}

  async storeProofOnchain(proof: Proof): Promise<void> {
    await this.storageAgent.store(proof.payload);
  }

  async verifyProofOnchain(
    publicInputForProofVerification: string,
  ): Promise<boolean> {
    const verified = await this.storageAgent.verify(
      publicInputForProofVerification,
    );
    return verified;
  }
}
