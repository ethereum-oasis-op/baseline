import { AutoMap } from '@automapper/classes';
import { BpiSubjectRoleDto } from './bpiSubjectRole.dto';
import { PublicKeyDto } from '../request/publicKey.dto';

export class BpiSubjectDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKeys: PublicKeyDto[];

  @AutoMap(() => [BpiSubjectRoleDto])
  roles: BpiSubjectRoleDto[];
}
