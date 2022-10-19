import { IsNotEmpty } from 'class-validator';

export class UpdateBpiSubjectAccountDto {
  @IsNotEmpty()
  id: string;
}
