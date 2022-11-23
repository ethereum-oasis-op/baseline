import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { CcsmAnchorHash } from '../models/ccsmAnchorHash';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';

@Injectable()
export class CcsmAnchorHashStorageAgent {
  constructor(private readonly storageAgent: BlockchainService) {}

  async storeCcsmAnchorHashOnCcsm(proof: CcsmAnchorHash): Promise<void> {
    await this.storageAgent.store(proof.hash);
  }

  async verifyCcsmAnchorHashOnCcsm(
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
