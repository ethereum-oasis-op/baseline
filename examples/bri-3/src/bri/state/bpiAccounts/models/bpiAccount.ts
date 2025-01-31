import { AutoMap } from '@automapper/classes';
import { BpiMerkleTree } from '../../../merkleTree/models/bpiMerkleTree';
import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class BpiAccount {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  nonce: number;

  @AutoMap(() => [BpiSubjectAccount])
  ownerBpiSubjectAccounts: BpiSubjectAccount[];

  @AutoMap()
  authorizationCondition: string;

  @AutoMap()
  stateObjectProverSystem: string;

  @AutoMap()
  stateTreeId: string;

  @AutoMap()
  stateTree: BpiMerkleTree;

  @AutoMap()
  historyTreeId: string;

  @AutoMap()
  historyTree: BpiMerkleTree;

  constructor(
    id: string,
    ownerBpiSubjectAccounts: BpiSubjectAccount[],
    authorizationCondition: string,
    stateObjectProverSystem: string,
    stateTree: BpiMerkleTree,
    historyTree: BpiMerkleTree,
  ) {
    this.id = id;
    this.nonce = 0;
    this.ownerBpiSubjectAccounts = ownerBpiSubjectAccounts;
    this.authorizationCondition = authorizationCondition;
    this.stateObjectProverSystem = stateObjectProverSystem;
    this.stateTree = stateTree;
    this.historyTree = historyTree;
  }

  public updateNonce(): void {
    this.nonce++;
  }
}
