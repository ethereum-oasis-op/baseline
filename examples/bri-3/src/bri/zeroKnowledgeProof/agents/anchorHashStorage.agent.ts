import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../components/blockchain/blockchain.service';

import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class AnchorHashStorageAgent {
  constructor(private storageAgent: BlockchainService) {}

  async storeAnchorHashOnchain(proof: AnchorHash): Promise<void> {
    await this.storageAgent.store(proof.hash);
  }

  async verifyAnchorHashOnchain(
    publicWitnessForProofVerification: string,
    proof?: string,
    verificationKey?: string,
  ): Promise<boolean> {
    const verified = await this.storageAgent.verify(
      publicWitnessForProofVerification,
      proof,
      verificationKey,
    );
    return verified;
  }
}
