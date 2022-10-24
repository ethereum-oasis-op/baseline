import { AutoMap } from '@automapper/classes';
import { BpiSubjectDto } from '../../../../bpiSubjects/api/dtos/response/bpiSubject.dto';

export class BpiSubjectAccountDto {
  @AutoMap()
  id: string;

  @AutoMap(() => BpiSubjectDto)
  creatorBpiSubject: BpiSubjectDto;

  @AutoMap(() => BpiSubjectDto)
  ownerBpiSubject: BpiSubjectDto;
}
