import { Commitment } from './commitment';

export class MerkleTreeNode implements Commitment {

  readonly hash: string;
  readonly leafIndex: number;

  constructor(hash: string, leafIndex: number) {
    this.hash = hash;
    this.leafIndex = leafIndex;
  }

  location(): number {
    return this.leafIndex;
  }

  value(): string {
    return this.hash;
  }
}
