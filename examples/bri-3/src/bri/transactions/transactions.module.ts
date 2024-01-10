import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaMapper } from '../../../prisma/prisma.mapper';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SubjectAccountModule } from '../identity/bpiSubjectAccounts/subjectAccounts.module';
import { MerkleModule } from '../merkleTree/merkle.module';
import { WorkflowModule } from '../workgroup/workflows/workflows.module';
import { WorkstepModule } from '../workgroup/worksteps/worksteps.module';
import { ZeroKnowledgeProofModule } from '../zeroKnowledgeProof/zeroKnowledgeProof.module';
import { TransactionStorageAgent } from './agents/transactionStorage.agent';
import { TransactionAgent } from './agents/transactions.agent';
import { TransactionController } from './api/transactions.controller';
import { CreateTransactionCommandHandler } from './capabilities/createTransaction/createTransactionCommand.handler';
import { DeleteTransactionCommandHandler } from './capabilities/deleteTransaction/deleteTransactionCommand.handler';
import { GetAllTransactionsQueryHandler } from './capabilities/getAllTransactions/getAllTransactionsQuery.handler';
import { GetTransactionByIdQueryHandler } from './capabilities/getTransactionById/getTransactionByIdQuery.handler';
import { UpdateTransactionCommandHandler } from './capabilities/updateTransaction/updateTransactionCommand.handler';
import { TransactionsProfile } from './transactions.profile';

export const CommandHandlers = [
  CreateTransactionCommandHandler,
  UpdateTransactionCommandHandler,
  DeleteTransactionCommandHandler,
];

export const QueryHandlers = [
  GetTransactionByIdQueryHandler,
  GetAllTransactionsQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    SubjectAccountModule,
    WorkstepModule,
    WorkflowModule,
    AuthModule,
    MerkleModule,
    ZeroKnowledgeProofModule,
    PrismaModule,
  ],
  controllers: [TransactionController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    TransactionAgent,
    TransactionStorageAgent,
    TransactionsProfile,
    PrismaMapper,
  ],
  exports: [TransactionAgent, TransactionStorageAgent],
})
export class TransactionModule {}
