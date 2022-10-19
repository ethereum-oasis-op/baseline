import { BpiSubjectDto } from 'src/bri/identity/bpiSubjects/api/dtos/response/bpiSubject.dto';

export class BpiSubjectAccountDto {
  id: string;
  creatorBpiSubject: BpiSubjectDto;
  ownerBpiSubject: BpiSubjectDto;
}
