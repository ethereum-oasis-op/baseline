import { BpiAccount } from '../../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
export class CcsmAnchorHashDto {
  id: string;
  owner: BpiSubjectAccount;
  agreementState: BpiAccount;
  hash: string;
  signature: string;
}
