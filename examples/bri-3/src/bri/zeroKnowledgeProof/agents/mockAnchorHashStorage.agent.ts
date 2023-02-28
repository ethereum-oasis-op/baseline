import { Injectable } from '@nestjs/common';
import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class MockAnchorHashStorageAgent {
  private anchorHashesStore: AnchorHash[] = [];

  async storeNewAnchorHash(anchorHash: AnchorHash): Promise<AnchorHash> {
    const createdHash = new AnchorHash(
      anchorHash.id,
      anchorHash.ownerBpiSubjectId,
      anchorHash.hash,
    );

    this.anchorHashesStore.push(createdHash);

    return Promise.resolve(createdHash);
  }

  async deleteAnchorHash(anchorHash: AnchorHash): Promise<void> {
    const hashToDeleteIndex = this.anchorHashesStore.findIndex(
      (hash) => hash.id === anchorHash.id,
    );
    this.anchorHashesStore.splice(hashToDeleteIndex, 1);
  }
}
