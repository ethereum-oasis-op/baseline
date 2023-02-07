import { AutoMap } from '@automapper/classes';

export class AnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  @AutoMap()
  hash: string;

  constructor(id: string, ownerBpiSubjectId: string, hash: string) {
    this.id = id;
    this.ownerBpiSubjectId = ownerBpiSubjectId;
    this.hash = hash;
  }
}
