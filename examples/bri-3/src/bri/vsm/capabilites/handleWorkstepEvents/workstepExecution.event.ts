import { Transaction } from 'src/bri/transactions/models/transaction';

export class WorkstepExecutionEvent {
  constructor(
    public readonly tx: Transaction,
    public readonly status: string,
  ) {}
}
