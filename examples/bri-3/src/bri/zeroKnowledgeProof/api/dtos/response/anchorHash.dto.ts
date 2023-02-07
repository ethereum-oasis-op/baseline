import { AutoMap } from '@automapper/classes';

export class AnchorHashDto {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  @AutoMap()
  hash: string;
}
