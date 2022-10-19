import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';

export class BpiAccount {
  private _id: string; // TODO: Add uuid after #491
  private _nonce: number;
  private _ownerBpiSubjectAccounts: BpiSubjectAccount[];

  constructor(id: string, ownerBpiSubjectAccounts: BpiSubjectAccount[]) {
    this._id = id;
    this._nonce = 0;
    this._ownerBpiSubjectAccounts = ownerBpiSubjectAccounts;
  }

  public get id(): string {
    return this._id;
  }

  public get nonce(): number {
    return this._nonce;
  }

  public get ownerBpiSubjectAccounts(): BpiSubjectAccount[] {
    return this._ownerBpiSubjectAccounts;
  }

  public updateNonce(): void {
    this._nonce++;
  }
}
