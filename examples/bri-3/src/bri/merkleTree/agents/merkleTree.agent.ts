import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeStorageAgent } from './merkleTreeStorage.agent';
import { MERKLE_TREE_NOT_FOUND } from '../api/err.messages';
import { MerkleTreeService } from '../services/merkleTree.service';

@Injectable()
export class MerkleTreeAgent {
  constructor(
    private storageAgent: MerkleTreeStorageAgent,
    private readonly service: MerkleTreeService,
  ) {}

  public createNewMerkleTree(leaves: string[]): BpiMerkleTree {
    return new BpiMerkleTree(
      v4(),
      'sha256',
      this.service.formMerkleTree(leaves, 'sha256'),
    );
  }

  public async fetchMerkleTreeByIdAndThrowIfValidationFails(
    id: string,
  ): Promise<BpiMerkleTree> {
    const merkleTree = await this.storageAgent.getMerkleTreeById(id);

    if (!merkleTree) {
      throw new NotFoundException(MERKLE_TREE_NOT_FOUND(id));
    }

    return merkleTree;
  }
}
