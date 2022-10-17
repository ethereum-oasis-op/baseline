import { Workstep } from '../../worksteps/models/workstep';

export class Workflow {
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _worksteps: Workstep[]; //TODO enforce workstep causal connection through collection order
  private _workgroupId: string;

  constructor(
    id: string,
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
  ) {
    this._id = id;
    this._name = name;
    this._worksteps = worksteps;
    this._workgroupId = workgroupId;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get worksteps(): Workstep[] {
    return this._worksteps;
  }

  public get workgroupId(): string {
    return this._workgroupId;
  }

  public updateName(newName: string): void {
    this._name = newName;
  }

  public updateWorksteps(newWorksteps: Workstep[]): void {
    this._worksteps = newWorksteps;
  }

  public updateWorkgroupId(newWorkgroupId: string): void {
    this._workgroupId = newWorkgroupId;
  }
}
