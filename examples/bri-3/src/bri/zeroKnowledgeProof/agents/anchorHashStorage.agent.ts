import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { AnchorHash } from '../models/anchorHash';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';

@Injectable()
export class AnchorHashStorageAgent {
  constructor(private storageAgent: BlockchainService) {}

  async storeAnchorHashOnchain(proof: AnchorHash): Promise<void> {
    await this.storageAgent.store(proof.hash);
  }

  async verifyAnchorHashOnchain(
    publicInputForProofVerification:
      | string
      | ZeroKnowledgeProofVerificationInput,
  ): Promise<boolean> {
    const verified = await this.storageAgent.verify(
      publicInputForProofVerification,
    );
    return verified;
  }
}
