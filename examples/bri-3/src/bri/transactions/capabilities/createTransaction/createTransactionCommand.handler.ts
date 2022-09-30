import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { TransactionStatus } from '../../models/transactionStatus.enum';
import { CreateTransactionCommand } from './createTransaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private agent: TransactionAgent,
    private repo: TransactionStorageAgent,
  ) {}

  async execute(command: CreateTransactionCommand) {
    this.agent.throwIfCreateTransactionInputInvalid();

    const newTransactionCandidate = this.agent.createNewTransaction(
      command.transactionId,
      command.nonce,
      command.workflowInstanceId,
      command.workstepInstanceId,
      command.from,
      command.to,
      command.payload,
      command.signature,
      TransactionStatus.Initialized,
    );

    const newTransaction = await this.repo.createNewTransaction(
      newTransactionCandidate,
    );

    return newTransaction.transactionId;
  }
}
