import { AutoMap } from '@automapper/classes';
import { AnchorHash } from './anchorHash';

export class State {
  @AutoMap()
  id: number;

  @AutoMap()
  content: string;

  @AutoMap()
  contentAddressableHash?: AnchorHash;

  constructor(
    id: number,
    content: string,
    contentAddressableHash?: AnchorHash,
  ) {
    this.id = id;
    this.content = content;
    this.contentAddressableHash = contentAddressableHash;
  }
}
