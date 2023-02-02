import { AutoMap } from '@automapper/classes';

export class AnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  @AutoMap()
  hash: string;

  @AutoMap()
  stateId: number;

  constructor(
    id: string,
    ownerBpiSubjectId: string,
    hash: string,
    stateId: number,
  ) {
    this.id = id;
    this.ownerBpiSubjectId = ownerBpiSubjectId;
    this.hash = hash;
    this.stateId = stateId;
  }
}
