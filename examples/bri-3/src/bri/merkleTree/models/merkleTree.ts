import { AutoMap } from '@automapper/classes';

export class BpiMerkleTree {
  @AutoMap()
  id: string;

  @AutoMap()
  leaves: string[];

  @AutoMap()
  hashFunction: unknown;

  constructor(id: string, leaves: string[], hashFunction: unknown) {
    this.id = id;
    this.leaves = leaves;
    this.hashFunction = hashFunction;
  }

  public updateLeaves(newLeaves: string[]): void {
    this.leaves = newLeaves;
  }

  public updateHashFunction(newHashFunction: unknown): void {
    this.hashFunction = newHashFunction;
  }
}
