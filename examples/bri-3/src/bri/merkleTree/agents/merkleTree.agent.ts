import { Injectable } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { BinaryHashTree } from '../models/merkleTree';

@Injectable()
export class MerkleTreeAgent {
  public createNewMerkleTree(
    leaves: string[],
    hashFunction: unknown,
  ): MerkleTree {
    return new MerkleTree(leaves, hashFunction);
  }

  public updateMerkleTree(
    binaryHashTreeToUpdate: BinaryHashTree,
    leaves: string[],
    hashFunction: unknown,
  ) {
    binaryHashTreeToUpdate.updateMerkleTree(
      new MerkleTree(leaves, hashFunction),
    );
  }
}
