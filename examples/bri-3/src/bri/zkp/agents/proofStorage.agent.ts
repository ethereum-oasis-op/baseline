import { Injectable, NotFoundException } from '@nestjs/common';
import { BlockchainService } from '../../../../blockchain/blockchain.service';

import { Proof } from '../models/proof';

@Injectable()
export class ProofStorageAgent extends BlockchainService {
  async storeProofInShieldContract(proof: Proof): Promise<void> {
    await this.store(proof.payload);
  }

  async verifyProofInShieldContract(proofToVerify: string): Promise<boolean> {
    const verified = await this.verify(proofToVerify);
    return verified;
  }
}
