import { AutoMap } from '@automapper/classes';
import { BpiSubjectDto } from '../../../../../identity/bpiSubjects/api/dtos/response/bpiSubject.dto';
import { WorkstepDto } from '../../../../../workgroup/worksteps/api/dtos/response/workstep.dto';
import { WorkflowDto } from '../../../../../workgroup/workflows/api/dtos/response/workflow.dto';
import { WorkgroupStatus } from '../../../models/workgroup';

export class WorkgroupDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [BpiSubjectDto])
  administrators: BpiSubjectDto[];

  @AutoMap()
  securityPolicy: string;

  @AutoMap()
  privacyPolicy: string;

  @AutoMap(() => [BpiSubjectDto])
  participants: BpiSubjectDto[];

  @AutoMap(() => [WorkstepDto])
  worksteps: WorkstepDto[];

  @AutoMap(() => [WorkflowDto])
  workflows: WorkflowDto[];

  @AutoMap()
  status: WorkgroupStatus;
}
