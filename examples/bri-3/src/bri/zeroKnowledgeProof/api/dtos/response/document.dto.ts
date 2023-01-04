import { CCSMAnchorHash } from '../../../models/ccsmAnchorHash';

export class DocumentDto {
  id: number;
  text: string;
  contentAddressableHash?: CCSMAnchorHash;
}
