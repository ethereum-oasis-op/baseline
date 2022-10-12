export class BpiAccount {
  private _id: string; // TODO: Add uuid after #491
  private _nonce: number;
  private _ownerBpiSubjectIds: string[];

  constructor(id: string, ownerBpiSubjectIds: string[]) {
    this._id = id;
    this._nonce = 0;
    this._ownerBpiSubjectIds = ownerBpiSubjectIds;
  }

  public get id(): string {
    return this._id;
  }

  public get nonce(): number {
    return this._nonce;
  }

  public get ownerBpiSubjectIds(): string[] {
    return this._ownerBpiSubjectIds;
  }

  public updateNonce(): void {
    this._nonce++;
  }
}
