import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
  private _id: string; // TODO: Add uuid after #491
  private _creatorBpiSubject: BpiSubject;
  private _ownerBpiSubject: BpiSubject;

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

  public get creatorBpiSubject(): BpiSubject {
    return this._creatorBpiSubject;
  }

  public get ownerBpiSubject(): BpiSubject {
    return this._ownerBpiSubject;
  }
}
