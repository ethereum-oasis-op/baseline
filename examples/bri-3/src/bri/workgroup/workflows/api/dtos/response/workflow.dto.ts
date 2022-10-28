import { AutoMap } from '@automapper/classes';
import { Workstep } from '../../../../worksteps/models/workstep';

export class WorkflowDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [Workstep])
  worksteps: Workstep[];

  @AutoMap()
  workgroupId: string;
}
