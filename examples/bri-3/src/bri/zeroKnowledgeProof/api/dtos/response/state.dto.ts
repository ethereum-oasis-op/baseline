import { AutoMap } from '@automapper/classes';
import { AnchorHash } from '../../../models/anchorHash';

export class StateDto {
  @AutoMap()
  id: number;

  @AutoMap()
  content: string;

  @AutoMap()
  contentAddressableHash?: AnchorHash;
}
