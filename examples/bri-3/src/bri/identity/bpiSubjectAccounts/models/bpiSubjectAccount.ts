import { AutoMap } from '@automapper/classes';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';

export class BpiSubjectAccount {
  @AutoMap()
  id: string; // TODO: Add uuid after #491

  //Placeholder
  @AutoMap(() => BpiSubject)
  authenticationPolicy: string;

  //Placeholder
  @AutoMap(() => BpiSubject)
  authorizationPolicy: string;

  //Placeholder
  @AutoMap(() => BpiSubject)
  verifiableCredential: string;

  //Placeholder
  @AutoMap(() => BpiSubject)
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
    authenticationPoliy: string,
    authorizationPolicy: string,
    verifiableCredential: string,
    recoveryKey: string,
  ) {
    this.id = id;
    this.creatorBpiSubject = creatorBpiSubject;
    this.creatorBpiSubjectId = creatorBpiSubject?.id;
    this.ownerBpiSubject = ownerBpiSubject;
    this.ownerBpiSubjectId = ownerBpiSubject?.id;
    this.authenticationPolicy = authenticationPoliy;
    this.authorizationPolicy = authorizationPolicy;
    this.verifiableCredential = verifiableCredential;
    this.recoveryKey = recoveryKey;
  }
}
