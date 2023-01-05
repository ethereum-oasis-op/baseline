import { AutoMap } from '@automapper/classes';

export class CCSMAnchorHashDto {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  @AutoMap()
  hash: string;

  @AutoMap()
  documentId: string;
}
