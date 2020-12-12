import { Commitment } from './commitment';

export class MerkleTreeNode implements Commitment {

  readonly hash: string;
  readonly index: number;

  constructor(hash: string, index: number) {
    this.hash = hash;
    this.index = index;
  }

  location(): number {
    return this.index;
  }

  value(): string {
    return this.hash;
  }
}
