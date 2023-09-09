import { AutoMap } from '@automapper/classes';
import { WorkstepDto } from '../../../../worksteps/api/dtos/response/workstep.dto';

export class WorkflowDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [WorkstepDto])
  worksteps: WorkstepDto[];

  @AutoMap()
  workgroupId: string;

  @AutoMap()
  bpiAccountId: string;
}
