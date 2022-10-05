import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  nonce: number;

  @IsNotEmpty()
  workflowInstanceId: string;

  @IsNotEmpty()
  workstepInstanceId: string;

  @IsNotEmpty()
  fromAccountId: string;

  @IsNotEmpty()
  toAccountId: string;

  @IsNotEmpty()
  payload: string;

  @IsNotEmpty()
  signature: string;
}
