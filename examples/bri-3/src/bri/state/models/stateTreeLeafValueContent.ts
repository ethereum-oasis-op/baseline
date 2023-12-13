import { AutoMap } from '@automapper/classes';
import { BpiAccount } from '../bpiAccounts/models/bpiAccount';
import MerkleTree from 'merkletreejs';

export class StateTreeLeafValueContent {
  @AutoMap()
  id: string;

  @AutoMap()
  bpiAccountId: string;

  @AutoMap()
  BpiAccount: BpiAccount;

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
    id: string,
    bpiAccountId: string,
    BpiAccount: BpiAccount,
    leafIndex: number,
    leafValue: string,
    merkelizedPayload: string,
    witness: string,
    merkleTree: MerkleTree,
  ) {
    this.id = id;
    this.bpiAccountId = bpiAccountId;
    this.BpiAccount = BpiAccount;
    this.leafIndex = leafIndex;
    this.leafValue = leafValue;
    this.merkelizedPayload = merkelizedPayload;
    this.witness = witness;
    this.merkleTree = merkleTree;
  }
}
