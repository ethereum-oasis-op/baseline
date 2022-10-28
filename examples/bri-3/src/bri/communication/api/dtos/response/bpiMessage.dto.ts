import { AutoMap } from '@automapper/classes';
import { BpiMessageType } from '../../../models/bpiMessageType.enum';
import { BpiSubjectDto } from '../../../../identity/bpiSubjects/api/dtos/response/bpiSubject.dto';

export class BpiMessageDto {
  @AutoMap()
  id: string;

  @AutoMap()
  from: BpiSubjectDto;

  @AutoMap()
  to: BpiSubjectDto;

  @AutoMap()
  content: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  type: BpiMessageType;
}
