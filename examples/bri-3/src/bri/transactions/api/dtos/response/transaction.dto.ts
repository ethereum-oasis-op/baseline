import { AutoMap } from '@automapper/classes';
import { TransactionStatus } from '../../../models/transactionStatus.enum';

export class TransactionDto {
  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap()
  workflowInstanceId: string;

  @AutoMap()
  workstepInstanceId: string;

  @AutoMap()
  from: string;

  @AutoMap()
  to: string;

  @AutoMap()
  payload: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  status: TransactionStatus;
}
