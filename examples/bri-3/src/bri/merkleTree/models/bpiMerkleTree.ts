import { AutoMap } from '@automapper/classes';
import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto';

export class BpiMerkleTree {
  @AutoMap()
  id: string;

  @AutoMap()
  merkleTree: MerkleTree;

  constructor(id: string, merkleTree: MerkleTree) {
    this.id = id;
    this.merkleTree = merkleTree;
  }

  public updateMerkleTree(
    hashedLeaves: Buffer[],
    hashFunction: (data: any) => Buffer,
  ): void {
    this.merkleTree = new MerkleTree(hashedLeaves, hashFunction);
  }
}
