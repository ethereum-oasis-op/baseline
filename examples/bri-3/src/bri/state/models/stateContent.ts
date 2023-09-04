import { AutoMap } from '@automapper/classes';
import { StateLeafValues } from './stateLeafValues';
import MerkleTree from 'merkletreejs';

export class StateContent {
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

  constructor(stateLeafValues: StateLeafValues, merkleTree: MerkleTree) {
    this.leafIndex = stateLeafValues.leafIndex;
    this.leafValue = stateLeafValues.leafValue;
    this.merkelizedPayload = stateLeafValues.merkelizedPayload;
    this.witness = stateLeafValues.witness;
    this.merkleTree = merkleTree;
  }
}
