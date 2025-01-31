import { AutoMap } from '@automapper/classes';
import { TransactionStatus } from '../../../models/transactionStatus.enum';

export class TransactionDto {
  @AutoMap()
  id: string;

  @AutoMap()
  nonce: number;

  @AutoMap()
  workflowId: string;

  @AutoMap()
  workflowInstanceId: string;

  @AutoMap()
  workstepId: string;

  @AutoMap()
  workstepInstanceId: string;

  @AutoMap()
  fromBpiSubjectAccountId: string;

  @AutoMap()
  toBpiSubjectAccountId: string;

  @AutoMap()
  payload: string;

  @AutoMap()
  signature: string;

  @AutoMap()
  status: TransactionStatus;
}
