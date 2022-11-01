import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';

export class BpiAccount {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  nonce: number;

  @AutoMap(() => [BpiSubjectAccount])
  ownerBpiSubjectAccounts: BpiSubjectAccount[];

  constructor(id: string, ownerBpiSubjectAccounts: BpiSubjectAccount[]) {
    this.id = id;
    this.nonce = 0;
    this.ownerBpiSubjectAccounts = ownerBpiSubjectAccounts;
  }

  public updateNonce(): void {
    this.nonce++;
  }
}
