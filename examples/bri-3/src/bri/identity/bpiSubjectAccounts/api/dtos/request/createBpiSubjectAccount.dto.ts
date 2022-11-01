import { IsNotEmpty } from 'class-validator';

export class CreateBpiSubjectAccountDto {
  @IsNotEmpty()
  creatorBpiSubjectId: string;

  @IsNotEmpty()
  ownerBpiSubjectId: string;
}
