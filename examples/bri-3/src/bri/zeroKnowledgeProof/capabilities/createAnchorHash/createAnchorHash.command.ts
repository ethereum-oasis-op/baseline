import { DocumentObject } from '../../models/document';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';

export class CreateAnchorHashCommand {
  constructor(
    public readonly ownerAccountId: BpiAccount,
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
