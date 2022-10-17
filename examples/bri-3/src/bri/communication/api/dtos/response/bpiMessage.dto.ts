import { BpiMessageType } from 'src/bri/communication/models/bpiMessageType.enum';
import { BpiSubjectDto } from 'src/bri/identity/bpiSubjects/api/dtos/response/bpiSubject.dto';

export interface BpiMessageDto {
  id: string;
  from: BpiSubjectDto;
  to: BpiSubjectDto;
  content: string;
  signature: string;
  type: BpiMessageType;
}
