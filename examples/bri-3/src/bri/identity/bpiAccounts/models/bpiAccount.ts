export class BpiAccount {
  private _id: string; // TODO: Add uuid after #491
  private _nonce: string;
  private _ownerBpiSubjectIds: string[];

  constructor(id: string, nonce: string, ownerBpiSubjectIds: string[]) {
    this._id = id;
    this._nonce = nonce;
    this._ownerBpiSubjectIds = ownerBpiSubjectIds;
  }

  public get id(): string {
    return this._id;
  }

  public get nonce(): string {
    return this._nonce;
  }

  public get ownerBpiSubjectIds(): string[] {
    return this._ownerBpiSubjectIds;
  }

  public updateNonce(newNonce: string): void {
    this._nonce = newNonce;
  }
}
