import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateCCSMAnchorHashCommand {
  constructor(
    public readonly ownerAccount: BpiSubjectAccount,
    public readonly agreementState: BpiAccount,
    public readonly document: string,
    public readonly signature: string,
  ) {}
}
