import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionAgent } from './agents/transactions.agent';
import { TransactionStorageAgent } from './agents/transactionStorage.agent';
import { TransactionController } from './api/transactions.controller';
import { CreateTransactionCommandHandler } from './capabilities/createTransaction/createTransactionCommand.handler';
import { DeleteTransactionCommandHandler } from './capabilities/deleteTransaction/deleteTransactionCommand.handler';
import { GetTransactionByIdQueryHandler } from './capabilities/getTransactionById/getTransactionByIdQuery.handler';
import { UpdateTransactionCommandHandler } from './capabilities/updateTransaction/updateTransactionCommand.handler';

export const CommandHandlers = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  DeleteTransactionCommandHandler,
];

export const QueryHandlers = [
  GetTransactionByIdQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    TransactionAgent,
    TransactionStorageAgent],
})
export class TransactionModule {}
