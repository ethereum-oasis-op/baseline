import { AutoMap } from '@automapper/classes';
import { BpiMessageType } from '../../../models/bpiMessageType.enum';
import { BpiSubjectDto } from '../../../../identity/bpiSubjects/api/dtos/response/bpiSubject.dto';

export class BpiMessageDto {
  @AutoMap()
  id: string;

  @AutoMap(() => BpiSubjectDto)
  fromBpiSubject: BpiSubjectDto;

  @AutoMap(() => BpiSubjectDto)
  toBpiSubject: BpiSubjectDto;

  @AutoMap()
  content: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  type: BpiMessageType;
}
