import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { CreateTransactionCommand } from './createTransaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
  ) {}

  async execute(command: CreateTransactionCommand) {
    this.agent.throwIfCreateTransactionInputInvalid();

    const newTransactionCandidate = this.agent.createNewTransaction(
      command.id,
      command.nonce,
      command.workflowInstanceId,
      command.workstepInstanceId,
      null, // TODO: Fetch BpiAccount based on id ,
      null, // TODO: Fetch BpiAccount based on id ,
      command.payload,
      command.signature,
    );

    const newTransaction = await this.storageAgent.createNewTransaction(
      newTransactionCandidate,
    );

    return newTransaction.id;
  }
}
