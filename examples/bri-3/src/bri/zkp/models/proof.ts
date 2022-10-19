import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

export class Proof {
  private _id: string;
  private _owner: BpiAccount;
  private _payload: string;
  private _signature: string;

  constructor(
    id: string,
    owner: BpiAccount,
    document: string,
    signature: string,
  ) {
    this._id = id;
    this._owner = owner;

    //TODO: Convert document into merkle tree and store root as payload
    this._payload = document;
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

  public verifyPayload(): void {
    // TODO: Verify if the payload exists in the shield contract
  }
}
