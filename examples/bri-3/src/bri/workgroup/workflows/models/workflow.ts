import { AutoMap } from '@automapper/classes';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { Workstep } from '../../worksteps/models/workstep';

export class Workflow {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap()
  name: string;

  @AutoMap(() => [Workstep])
  worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order

  @AutoMap()
  workgroupId: string;

  @AutoMap()
  bpiAccountId: string;

  @AutoMap(() => BpiAccount)
  bpiAccount: BpiAccount;

  constructor(
    id: string,
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
    bpiAccount: BpiAccount,
  ) {
    this.id = id;
    this.name = name;
    this.worksteps = worksteps;
    this.workgroupId = workgroupId;
    this.bpiAccount = bpiAccount;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateWorksteps(newWorksteps: Workstep[]): void {
    this.worksteps = newWorksteps;
  }

  public updateWorkgroupId(newWorkgroupId: string): void {
    this.workgroupId = newWorkgroupId;
  }
}
