import { AutoMap } from '@automapper/classes';
import MerkleTree from 'merkletreejs';

export class BinaryHashTree {
  @AutoMap()
  id: string;

  @AutoMap()
  merkleTree: MerkleTree;

  constructor(id: string, merkleTree: MerkleTree) {
    this.id = id;
    this.merkleTree = merkleTree;
  }

  public updateMerkleTree(newMerkleTree: MerkleTree): void {
    this.merkleTree = newMerkleTree;
  }
}
