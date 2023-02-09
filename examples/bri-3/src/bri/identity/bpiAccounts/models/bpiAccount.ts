import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';

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
  stateObjectStorage: string;

  constructor(
    id: string,
    ownerBpiSubjectAccounts: BpiSubjectAccount[],
    authorizationCondition: string,
    stateObjectProverSystem: string,
    stateObjectStorage: string,
  ) {
    this.id = id;
    this.nonce = 0;
    this.ownerBpiSubjectAccounts = ownerBpiSubjectAccounts;
    this.authorizationCondition = authorizationCondition;
    this.stateObjectProverSystem = stateObjectProverSystem;
    this.stateObjectStorage = stateObjectStorage;
  }

  public updateNonce(): void {
    this.nonce++;
  }
}
