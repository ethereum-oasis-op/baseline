import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateCcsmAnchorHashCommand {
  constructor(
    public readonly ownerAccount: BpiSubjectAccount,
    public readonly document: string,
  ) {}
}
