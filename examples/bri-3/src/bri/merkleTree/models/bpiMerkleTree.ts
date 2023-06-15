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

  public updateMerkleTree(hashAlgName: string, tree: MerkleTree): void {
    this.hashAlgName = hashAlgName;
    this.tree = tree;
  }
}
