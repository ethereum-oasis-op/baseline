import { DocumentObject } from '../../models/document';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateCCSMAnchorCommand {
  constructor(
    public readonly ownerAccount: BpiSubjectAccount,
    public readonly agreementState: BpiAccount,
    public readonly document: DocumentObject,
    public readonly signature: string,
  ) {}
}
