import { AutoMap } from '@automapper/classes';
import { BpiSubjectRoleDto } from './bpiSubjectRole.dto';

export class BpiSubjectDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: string;

  @AutoMap(() => [BpiSubjectRoleDto])
  roles: BpiSubjectRoleDto[];
}
