import { Transaction } from 'src/bri/transactions/models/transaction';

export class WorkstepExecutedEvent {
  constructor(
    public readonly tx: Transaction,
    public readonly status: string,
  ) {}
}
