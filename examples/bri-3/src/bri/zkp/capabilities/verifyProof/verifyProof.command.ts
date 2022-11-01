import DocumentObject from '../../types/document';

export class VerifyProofCommand {
  constructor(
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
