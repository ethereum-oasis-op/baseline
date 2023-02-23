import { AutoMap } from '@automapper/classes';

export class Leaf {
  @AutoMap()
  id: string;

  @AutoMap()
  signedDocumentHash: string;

  @AutoMap()
  data: Record<string, unknown>;

  constructor(
    id: string,
    signedDocumentHash: string,
    data: Record<string, unknown>,
  ) {
    this.id = id;
    this.signedDocumentHash = signedDocumentHash;
    this.data = data;
  }
}
