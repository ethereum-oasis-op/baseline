import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class CreateWorkflowCommand {
  constructor(
    public readonly name: string,
    public readonly worksteps: Workstep[],
    public readonly workgroupId: string,
  ) {}
}
