import { BpiAccount } from '../../../../identity/bpiAccounts/models/bpiAccount';
export interface AnchorHashDto {
  id: string;
  owner: BpiAccount;
  hash: string;
  signature: string;
}
