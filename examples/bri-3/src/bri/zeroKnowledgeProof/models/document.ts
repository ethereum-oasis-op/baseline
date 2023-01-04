import { AutoMap } from '@automapper/classes';
import { CCSMAnchorHash } from './ccsmAnchorHash';

export class Document {
  @AutoMap()
  id: number;

  @AutoMap()
  text: string;

  @AutoMap()
  contentAddressableHash?: CCSMAnchorHash;

  constructor(
    id: number,
    text: string,
    contentAddressableHash?: CCSMAnchorHash,
  ) {
    this.id = id;
    this.text = text;
    this.contentAddressableHash = contentAddressableHash;
  }
}
