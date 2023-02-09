import { AutoMap } from '@automapper/classes';
import { BpiSubjectDto } from '../../../../bpiSubjects/api/dtos/response/bpiSubject.dto';

export class BpiSubjectAccountDto {
  @AutoMap()
  id: string;

  @AutoMap(() => BpiSubjectDto)
  creatorBpiSubject: BpiSubjectDto;

  @AutoMap(() => BpiSubjectDto)
  ownerBpiSubject: BpiSubjectDto;

  //Placeholder
  @AutoMap(() => BpiSubjectDto)
  authenticationPolicy: string;

  //Placeholder
  @AutoMap(() => BpiSubjectDto)
  authorizationPolicy: string;

  //Placeholder
  @AutoMap(() => BpiSubjectDto)
  verifiableCredential: string;

  //Placeholder
  @AutoMap(() => BpiSubjectDto)
  recoveryKey: string;
}
