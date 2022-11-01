import { Injectable, NotFoundException } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { Proof } from '../models/proof';

@Injectable()
export class ProofStorageAgent {
  constructor(private storageAgent: BlockchainService) {}

  async storeProofInShieldContract(proof: Proof): Promise<void> {
    await this.storageAgent.store(proof.payload);
  }

  async verifyProofInShieldContract(
    publicInputForProofVerification: string,
  ): Promise<boolean> {
    const verified = await this.storageAgent.verify(
      publicInputForProofVerification,
    );
    return verified;
  }
}
