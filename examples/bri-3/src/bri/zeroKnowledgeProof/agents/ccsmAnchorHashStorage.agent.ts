import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain/blockchain.service';

import { CcsmAnchorHash } from '../models/ccsmAnchorHash';

@Injectable()
export class CcsmAnchorHashStorageAgent {
  constructor(private readonly storageAgent: BlockchainService) {}

  async storeAnchorHashOnCcsm(CcsmAnchorHash: CcsmAnchorHash): Promise<void> {
    await this.storageAgent.store(CcsmAnchorHash.hash);
  }

  async getAnchorHashFromCcsm(
    publicInputForProofVerification: string,
  ): Promise<string> {
    const CcsmAnchorHash = await this.storageAgent.get(
      publicInputForProofVerification,
    );
    return CcsmAnchorHash;
  }
}
