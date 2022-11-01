import DocumentObject from '../../types/document';

export class CreateProofCommand {
  constructor(
    public readonly ownerAccountId: string,
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
