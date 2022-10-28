import { AutoMap } from '@automapper/classes';
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

  constructor(
    id: string,
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
  ) {
    this.id = id;
    this.name = name;
    this.worksteps = worksteps;
    this.workgroupId = workgroupId;
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
