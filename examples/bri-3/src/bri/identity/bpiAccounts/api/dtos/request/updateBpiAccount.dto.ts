import { IsNotEmpty } from 'class-validator';

export class UpdateBpiAccountDto {
  @IsNotEmpty()
  nonce: string;
}
