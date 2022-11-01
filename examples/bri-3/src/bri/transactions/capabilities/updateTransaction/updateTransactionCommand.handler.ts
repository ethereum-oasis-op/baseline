import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { Transaction } from '../../models/transaction';
import { UpdateTransactionCommand } from './updateTransaction.command';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
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

    const updatedTransaction = await this.storageAgent.updateTransaction(
      transactionToUpdate,
    );

    return this.mapper.map(updatedTransaction, Transaction, TransactionDto);
  }
}
