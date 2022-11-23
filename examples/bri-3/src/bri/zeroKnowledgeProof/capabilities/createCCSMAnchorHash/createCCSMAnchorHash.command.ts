import { BpiSubjectAccount } from '../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';

export class CreateCCSMAnchorHashCommand {
  constructor(
    public readonly ownerAccount: BpiSubjectAccount,
    public readonly document: string,
  ) {}
}
