import { Transaction } from 'src/bri/transactions/models/transaction';

export class WorkstepExecutionFailuresEvent {
  constructor(public readonly tx: Transaction, public readonly err: string) {}
}
