import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { DeleteTransactionCommand } from './deleteTransaction.command';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionCommandHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  constructor(
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
  ) {}

  async execute(command: DeleteTransactionCommand) {
    const transactionToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );
    await this.storageAgent.deleteTransaction(transactionToDelete);

    return;
  }
}
