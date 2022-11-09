import { DocumentObject } from '../../models/document';

export class VerifyAnchorHashCommand {
  constructor(
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
