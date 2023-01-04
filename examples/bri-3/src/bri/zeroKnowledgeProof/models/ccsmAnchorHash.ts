import { AutoMap } from '@automapper/classes';

export class CCSMAnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  @AutoMap()
  hash: string;

  @AutoMap()
  documentId: number;

  constructor(
    id: string,
    ownerBpiSubjectId: string,
    hash: string,
    documentId: number,
  ) {
    this.id = id;
    this.ownerBpiSubjectId = ownerBpiSubjectId;
    this.hash = hash;
    this.documentId = documentId;
  }
}
