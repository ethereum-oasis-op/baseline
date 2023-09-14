import { AutoMap } from '@automapper/classes';
import MerkleTree from 'merkletreejs';

export class StateTreeLeafValueContentDto {
  @AutoMap()
  leafIndex: number;

  @AutoMap()
  leafValue: string;

  @AutoMap()
  merkelizedPayload: string;

  @AutoMap()
  witness: string;

  @AutoMap()
  merkleTree: MerkleTree;

  constructor(
    leafIndex: number,
    leafValue: string,
    merkelizedPayload: string,
    witness: string,
    merkleTree: MerkleTree,
  ) {
    this.leafIndex = leafIndex;
    this.leafValue = leafValue;
    this.merkelizedPayload = merkelizedPayload;
    this.witness = witness;
    this.merkleTree = merkleTree;
  }
}
