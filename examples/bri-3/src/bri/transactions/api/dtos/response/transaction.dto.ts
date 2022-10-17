import { TransactionStatus } from 'src/bri/transactions/models/transactionStatus.enum';

export interface TransactionDto {
  id: string;
  nonce: number;
  workflowInstanceId: string;
  workstepInstanceId: string;
  from: string;
  to: string;
  payload: string;
  signature: string;
  status: TransactionStatus;
}
