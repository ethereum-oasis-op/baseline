import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class Proof {
  private _id: string;
  private _owner: BpiAccount;
  private _payload: string;
  private _signature: string;

  constructor(
    id: string,
    owner: BpiAccount,
    payload: string,
    signature: string,
  ) {
    this._id = id;
    this._owner = owner;
    this._payload = payload;
    this._signature = signature;
  }

  public get id(): string {
    return this._id;
  }

  public get owner(): BpiAccount {
    return this._owner;
  }

  public get payload(): string {
    return this._payload;
  }

  public get signature(): string {
    return this._signature;
  }
}
