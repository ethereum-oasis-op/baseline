import { AutoMap } from '@automapper/classes';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  //Placeholder
  @AutoMap()
  authenticationPolicy: string;

  //Placeholder
  @AutoMap()
  authorizationPolicy: string;

  //Placeholder
  @AutoMap()
  verifiableCredential: string;

  //Placeholder
  @AutoMap()
  recoveryKey: string;

  @AutoMap(() => BpiSubject)
  creatorBpiSubject: BpiSubject;

  @AutoMap(() => BpiSubject)
  ownerBpiSubject: BpiSubject;

  @AutoMap()
  creatorBpiSubjectId: string;

  @AutoMap()
  ownerBpiSubjectId: string;

  constructor(
    id: string,
    creatorBpiSubject: BpiSubject,
    ownerBpiSubject: BpiSubject,
    authenticationPolicy: string,
    authorizationPolicy: string,
    verifiableCredential: string,
    recoveryKey: string,
  ) {
    this.id = id;
    this.creatorBpiSubject = creatorBpiSubject;
    this.creatorBpiSubjectId = creatorBpiSubject?.id;
    this.ownerBpiSubject = ownerBpiSubject;
    this.ownerBpiSubjectId = ownerBpiSubject?.id;
    this.authenticationPolicy = authenticationPolicy;
    this.authorizationPolicy = authorizationPolicy;
    this.verifiableCredential = verifiableCredential;
    this.recoveryKey = recoveryKey;
  }
}
