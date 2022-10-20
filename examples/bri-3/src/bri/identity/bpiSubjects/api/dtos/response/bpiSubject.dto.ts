import { AutoMap } from '@automapper/classes';

export class BpiSubjectDto {
  
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  publicKey: string;
}
