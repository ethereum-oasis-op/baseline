import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { CCSMAnchor } from '../models/ccsmAnchor';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';

@Injectable()
export class CCSMAnchorStorageAgent {
  constructor(private storageAgent: BlockchainService) {}

  async storeCCSMAnchorOnCCSM(proof: CCSMAnchor): Promise<void> {
    await this.storageAgent.store(proof.hash);
  }

  async verifyCCSMAnchorOnCCSM(
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
