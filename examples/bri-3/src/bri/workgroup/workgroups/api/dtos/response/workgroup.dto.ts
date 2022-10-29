import { AutoMap } from '@automapper/classes';
import { Workstep } from '../../../../worksteps/models/workstep';
import { Workflow } from '../../../../workflows/models/workflow';
import { BpiSubject } from '../../../../../identity/bpiSubjects/models/bpiSubject';

export class WorkgroupDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => [BpiSubject])
  administrators: BpiSubject[];

  @AutoMap()
  securityPolicy: string;

  @AutoMap()
  privacyPolicy: string;

  @AutoMap(() => [BpiSubject])
  participants: BpiSubject[];

  @AutoMap(() => [Workstep])
  worksteps: Workstep[];

  @AutoMap(() => [Workflow])
  workflows: Workflow[];
}
