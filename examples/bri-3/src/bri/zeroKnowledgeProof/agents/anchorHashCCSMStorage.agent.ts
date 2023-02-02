import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain/blockchain.service';

import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class AnchorHashCCSMStorageAgent {
  constructor(private readonly ccsmStorageAgent: BlockchainService) {}

  async storeAnchorHashOnCCSM(anchorHash: AnchorHash): Promise<void> {
    await this.ccsmStorageAgent.write(anchorHash.hash);
  }

  async getAnchorHashFromCCSM(
    publicInputForProofVerification: string,
  ): Promise<string> {
    const anchorHash = await this.ccsmStorageAgent.read(
      publicInputForProofVerification,
    );
    return anchorHash;
  }
}
