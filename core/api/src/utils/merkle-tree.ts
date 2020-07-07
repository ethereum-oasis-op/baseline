export class MerkleTreeNode {

  readonly hash: string;
  readonly index: number;

  constructor(hash: string, index: number) {
    this.hash = hash;
    this.index = index;
  }
}
