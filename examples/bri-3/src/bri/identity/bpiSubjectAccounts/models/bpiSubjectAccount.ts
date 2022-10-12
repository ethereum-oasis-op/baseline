import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
  private _id: string; // TODO: Add uuid after #491
  private _creatorBpiSubject: BpiSubject;
  private _ownerBpiSubject: BpiSubject;
  private bpiAccounts: string[]; // TODO: Add as part of #489

  constructor(
    id: string,
    creatorBpiSubject: BpiSubject,
    ownerBpiSubject: BpiSubject,
  ) {
    this._id = id;
    this._creatorBpiSubject = creatorBpiSubject;
    this._ownerBpiSubject = ownerBpiSubject;
  }

  public get id(): string {
    return this._id;
  }

  public get creatorBpiSubjectId(): string {
    return this._creatorBpiSubject.id;
  }

  public get ownerBpiSubjectId(): string {
    return this._ownerBpiSubject.id;
  }
}
