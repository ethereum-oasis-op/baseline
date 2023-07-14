import { AutoMap } from '@automapper/classes';
import MerkleTree from 'merkletreejs';

export class BpiMerkleTree {
  @AutoMap()
  id: string;

  @AutoMap()
  hashAlgName: string;

  @AutoMap()
  tree: MerkleTree;

  constructor(id: string, hashAlgName: string, tree: MerkleTree) {
    this.id = id;
    this.hashAlgName = hashAlgName;
    this.tree = tree;
  }

  public addLeaves(leaves: string[]): void {
    const bufferLeaves = leaves.map((leaf) => Buffer.from(leaf, 'utf-8'));
    this.tree.addLeaves(bufferLeaves, true);
  }
}
