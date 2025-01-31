import { IsNotEmpty } from 'class-validator';

export class CreateBpiAccountDto {
  @IsNotEmpty()
  ownerBpiSubjectAccountsIds: string[];
}
