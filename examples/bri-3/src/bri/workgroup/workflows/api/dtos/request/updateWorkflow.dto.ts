import { IsNotEmpty } from 'class-validator';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class UpdateWorkflowDto {
  @IsNotEmpty()
  name: string;

  worksteps: Workstep[];

  @IsNotEmpty()
  workgroupId: string;
}
