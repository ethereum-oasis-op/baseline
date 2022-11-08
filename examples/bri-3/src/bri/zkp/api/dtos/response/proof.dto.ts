import { BpiAccount } from '../../../../identity/bpiAccounts/models/bpiAccount';
export interface ProofDto {
  id: string;
  owner: BpiAccount;
  payload: string;
  signature: string;
}
