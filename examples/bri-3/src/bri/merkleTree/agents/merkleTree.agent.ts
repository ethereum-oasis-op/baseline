import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiMerkleTree } from '../models/merkleTree';
import { MerkleTreeStorageAgent } from './merkleTreeStorage.agent';

@Injectable()
export class MerkleTreeAgent {
  constructor(private storageAgent: MerkleTreeStorageAgent) {}
  public createNewMerkleTree(
    leaves: string[],
    hashFunction: unknown,
  ): BpiMerkleTree {
    return new BpiMerkleTree(v4(), leaves, hashFunction);
  }

  public updateMerkleTree(
    merkleTreeToUpdate: BpiMerkleTree,
    leaves: string[],
    hashFunction: unknown,
  ) {
    merkleTreeToUpdate.updateLeaves(leaves);
    merkleTreeToUpdate.updateHashFunction(hashFunction);
  }

  public async fetchMerkleTreeCandidateByIdAndThrowIfValidationFails(
    id: string,
  ): Promise<BpiMerkleTree> {
    const bpiSubjectToUpdate: BpiMerkleTree =
      await this.storageAgent.getMerkleTreeById(id);

    if (!bpiSubjectToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectToUpdate;
  }
}
