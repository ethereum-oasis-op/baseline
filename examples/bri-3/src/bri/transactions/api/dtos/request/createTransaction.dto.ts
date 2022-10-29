import { IsNotEmpty } from 'class-validator';

// TODO: Revisit validations rules once we move into business logic implementation
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
  fromSubjectAccountId: string;

  @IsNotEmpty()
  toSubjectAccountId: string;

  @IsNotEmpty()
  payload: string;

  @IsNotEmpty()
  signature: string;
}
