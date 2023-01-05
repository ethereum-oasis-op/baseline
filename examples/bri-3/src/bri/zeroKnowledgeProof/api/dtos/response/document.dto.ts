import { AutoMap } from '@automapper/classes';
import { CCSMAnchorHash } from '../../../models/ccsmAnchorHash';

export class DocumentDto {
  @AutoMap()
  id: number;

  @AutoMap()
  text: string;

  @AutoMap()
  contentAddressableHash?: CCSMAnchorHash;
}
