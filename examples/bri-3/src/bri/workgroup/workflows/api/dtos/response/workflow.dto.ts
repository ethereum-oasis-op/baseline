import { AutoMap } from '@automapper/classes';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';

export class WorkflowDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  worksteps: Workstep[];

  @AutoMap()
  workgroupId: string;
}
