import { AutoMap } from '@automapper/classes';
import { BpiMerkleTree } from '../../../merkleTree/models/bpiMerkleTree';
import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiMerkleTree } from 'src/bri/merkleTree/models/bpiMerkleTree';

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

  constructor(
    id: string,
    ownerBpiSubjectAccounts: BpiSubjectAccount[],
    authorizationCondition: string,
    stateObjectProverSystem: string,
  ) {
    this.id = id;
    this.nonce = 0;
    this.ownerBpiSubjectAccounts = ownerBpiSubjectAccounts;
    this.authorizationCondition = authorizationCondition;
    this.stateObjectProverSystem = stateObjectProverSystem;
  }

  public updateNonce(): void {
    this.nonce++;
  }
}
