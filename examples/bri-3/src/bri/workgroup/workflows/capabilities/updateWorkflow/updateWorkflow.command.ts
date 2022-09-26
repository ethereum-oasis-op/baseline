import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class UpdateWorkflowCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly worksteps: Workstep[],
    public readonly workgroupId: string,
  ) {}
}
