import { DocumentObject } from '../../models/document';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateAnchorHashCommand {
  constructor(
    public readonly ownerAccountId: BpiSubjectAccount,
    public readonly agreementState: BpiAccount,
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
