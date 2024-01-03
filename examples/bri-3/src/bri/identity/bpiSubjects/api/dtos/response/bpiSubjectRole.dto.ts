import { AutoMap } from '@automapper/classes';

export class BpiSubjectRoleDto {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;
}