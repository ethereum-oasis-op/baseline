import { AutoMap } from '@automapper/classes';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class CcsmAnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerId: string;

  @AutoMap()
  hash: string;

  constructor(id: string, ownerId: string, hash: string) {
    this.id = id;
    this.ownerId = ownerId;
    this.hash = hash;
  }
}
