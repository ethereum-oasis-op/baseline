import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateAnchorHashCommand {
  constructor(
    public readonly ownerAccount: BpiSubjectAccount,
    public readonly state: string,
    public readonly signature: string,
  ) {}
}
