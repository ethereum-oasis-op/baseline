import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { CCSMAnchorHash } from '../models/ccsmAnchorHash';
import { ZeroKnowledgeProofVerificationInput } from '../models/zeroKnowledgeProofVerificationInput';

@Injectable()
export class CCSMAnchorHashStorageAgent {
  constructor(private readonly storageAgent: BlockchainService) {}

  async storeCCSMAnchorHashOnCCSM(proof: CCSMAnchorHash): Promise<void> {
    await this.storageAgent.store(proof.hash);
  }

  async verifyCCSMAnchorHashOnCCSM(
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
