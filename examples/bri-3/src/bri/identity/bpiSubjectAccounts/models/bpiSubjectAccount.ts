import { AutoMap } from '@automapper/classes';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  @AutoMap(() => BpiSubject)
  creatorBpiSubject: BpiSubject;

  @AutoMap(() => BpiSubject)
  ownerBpiSubject: BpiSubject;

  creatorBpiSubjectId: string;

  ownerBpiSubjectId: string;

  constructor(
    id: string,
    creatorBpiSubject: BpiSubject,
    ownerBpiSubject: BpiSubject,
  ) {
    this.id = id;
    this.creatorBpiSubject = creatorBpiSubject;
    this.creatorBpiSubjectId = creatorBpiSubject.id;
    this.ownerBpiSubject = ownerBpiSubject;
    this.ownerBpiSubjectId = ownerBpiSubject.id;
  }
}
