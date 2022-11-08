import DocumentObject from '../../types/document';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';

export class CreateProofCommand {
  constructor(
    public readonly ownerAccountId: BpiAccount,
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
