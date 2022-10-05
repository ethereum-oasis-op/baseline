import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionAgent } from './agents/transactions.agent';
import { TransactionStorageAgent } from './agents/transactionStorage.agent';
import { TransactionController } from './api/transactions.controller';
import { CreateTransactionCommandHandler } from './capabilities/createTransaction/createTransactionCommand.handler';
import { DeleteTransactionCommandHandler } from './capabilities/deleteTransaction/deleteTransactionCommand.handler';
import { UpdateTransactionCommandHandler } from './capabilities/updateTransaction/updateTransactionCommand.handler';

export const CommandHandlers = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  DeleteTransactionCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [...CommandHandlers, TransactionAgent, TransactionStorageAgent],
})
export class TransactionModule {}
