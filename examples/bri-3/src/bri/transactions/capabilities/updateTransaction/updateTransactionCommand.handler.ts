import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { UpdateTransactionCommand } from './updateTransaction.command';
import Mapper from '../../../utils/mapper';
import { getType } from 'tst-reflect';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
    private readonly mapper: Mapper,
  ) {}

  async execute(command: UpdateTransactionCommand) {
    const transactionToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateTransaction(
      transactionToUpdate,
      command.payload,
      command.signature,
    );

    await this.storageAgent.updateTransaction(transactionToUpdate);
  }
}
