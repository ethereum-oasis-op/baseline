import { CCSMAnchorHash } from './ccsmAnchorHash';

export class Document {
  id: number;
  text: string;
  contentAddressableHash?: CCSMAnchorHash;
}
