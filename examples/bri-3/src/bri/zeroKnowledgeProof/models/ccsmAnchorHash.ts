import { AutoMap } from '@automapper/classes';

export class CCSMAnchorHash {
  @AutoMap()
  id: string;

  @AutoMap()
  ownerId: string;

  @AutoMap()
  hash: string;

  constructor(id: string, ownerId: string, hash: string) {
    this.id = id;
    this.ownerId = ownerId;
    this.hash = hash;
  }
}
