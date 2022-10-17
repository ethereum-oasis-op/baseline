import { IsNotEmpty } from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  payload: string;

  @IsNotEmpty()
  signature: string;
}
