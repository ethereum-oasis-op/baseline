import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaMapper } from '../../../../prisma/prisma.mapper';
import { PrismaModule } from '../../../shared/prisma/prisma.module';
import { SubjectAccountModule } from '../../identity/bpiSubjectAccounts/subjectAccounts.module';
import { MerkleModule } from '../../merkleTree/merkle.module';
import { AccountsProfile } from './accounts.profile';
import { BpiAccountAgent } from './agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from './agents/bpiAccountsStorage.agent';
import { AccountController } from './api/accounts.controller';
import { CreateBpiAccountCommandHandler } from './capabilities/createBpiAccount/createBpiAccountCommand.handler';
import { DeleteBpiAccountCommandHandler } from './capabilities/deleteBpiAccount/deleteBpiAccountCommand.handler';
import { GetAllBpiAccountsQueryHandler } from './capabilities/getAllBpiAccounts/getAllBpiAccountQuery.handler';
import { GetBpiAccountByIdQueryHandler } from './capabilities/getBpiAccountById/getBpiAccountByIdQuery.handler';
import { UpdateBpiAccountCommandHandler } from './capabilities/updateBpiAccount/updateBpiAccountCommand.handler';

export const CommandHandlers = [
  CreateBpiAccountCommandHandler,
  UpdateBpiAccountCommandHandler,
  DeleteBpiAccountCommandHandler,
];
export const QueryHandlers = [
  GetBpiAccountByIdQueryHandler,
  GetAllBpiAccountsQueryHandler,
];
@Module({
  imports: [CqrsModule, SubjectAccountModule, MerkleModule, PrismaModule],
  controllers: [AccountController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiAccountAgent,
    BpiAccountStorageAgent,
    AccountsProfile,
    PrismaMapper,
  ],
  exports: [BpiAccountAgent, BpiAccountStorageAgent],
})
export class AccountModule {}
