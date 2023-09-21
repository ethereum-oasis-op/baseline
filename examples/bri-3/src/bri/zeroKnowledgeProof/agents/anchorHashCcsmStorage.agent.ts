import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain/blockchain.interface';

import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class AnchorHashCcsmStorageAgent {
  constructor(private readonly ccsmStorageAgent: BlockchainService) {}

  async storeAnchorHashOnCcsm(anchorHash: AnchorHash): Promise<void> {
    await this.ccsmStorageAgent.write(anchorHash.hash);
  }

  async getAnchorHashFromCcsm(
    publicInputForProofVerification: string,
  ): Promise<string> {
    const anchorHash = await this.ccsmStorageAgent.read(
      publicInputForProofVerification,
    );
    return anchorHash;
  }
}
