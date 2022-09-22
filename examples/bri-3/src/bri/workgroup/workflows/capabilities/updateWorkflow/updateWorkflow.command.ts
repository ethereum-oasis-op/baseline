import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class UpdateWorkflowCommand {
  constructor(
    public readonly id: string,
    public readonly worksteps: Workstep[],
  ) {}
}
