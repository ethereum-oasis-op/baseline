import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { DeleteBpiSubjectCommandHandler } from './capabilities/deleteBpiSubject/deleteBpiSubjectCommand.handler';
import { GetAllBpiSubjectsQueryHandler } from './capabilities/getAllBpiSubjects/getAllBpiSubjectsQuery.handler';
import { GetBpiSubjectByIdQueryHandler } from './capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from './capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { BpiSubjectStorageAgent } from './agents/bpiSubjectsStorage.agent';
import { AccountController } from '../bpiAccounts/api/accounts.controller';
import { CreateBpiAccountCommandHandler } from '../bpiAccounts/capabilities/createBpiAccount/createBpiAccountCommand.handler';
import { UpdateBpiAccountCommandHandler } from '../bpiAccounts/capabilities/updateBpiAccount/updateBpiAccountCommand.handler';
import { DeleteBpiAccountCommandHandler } from '../bpiAccounts/capabilities/deleteBpiAccount/deleteBpiAccountCommand.handler';
import { GetAllBpiAccountsQueryHandler } from '../bpiAccounts/capabilities/getAllBpiAccounts/getAllBpiAccountQuery.handler';
import { GetBpiAccountByIdQueryHandler } from '../bpiAccounts/capabilities/getBpiAccountById/getBpiAccountByIdQuery.handler';
import { BpiAccountAgent } from '../bpiAccounts/agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../bpiAccounts/agents/bpiAccountsStorage.agent';
import { CreateBpiSubjectAccountCommandHandler } from '../bpiSubjectAccounts/capabilities/createBpiSubjectAccount/createBpiSubjectAccountCommand.handler';
import { DeleteBpiSubjectAccountCommandHandler } from '../bpiSubjectAccounts/capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccountCommand.handler';
import { UpdateBpiSubjectAccountCommandHandler } from '../bpiSubjectAccounts/capabilities/updateBpiSubjectAccount/updateBpiSubjectAccountCommand.handler';
import { GetAllBpiSubjectAccountsQueryHandler } from '../bpiSubjectAccounts/capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccountsQuery.handler';
import { GetBpiSubjectAccountByIdQueryHandler } from '../bpiSubjectAccounts/capabilities/getBpiSubjectAccountById/getBpiSubjectAccountByIdQuery.handler';
import { BpiSubjectAccountAgent } from '../bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { SubjectAccountController } from '../bpiSubjectAccounts/api/subjectAccounts.controller';

export const CommandHandlers = [
  CreateBpiSubjectCommandHandler,
  UpdateBpiSubjectCommandHandler,
  DeleteBpiSubjectCommandHandler,
  CreateBpiAccountCommandHandler,
  UpdateBpiAccountCommandHandler,
  DeleteBpiAccountCommandHandler,
  CreateBpiSubjectAccountCommandHandler,
  UpdateBpiSubjectAccountCommandHandler,
  DeleteBpiSubjectAccountCommandHandler,
];
export const QueryHandlers = [
  GetBpiSubjectByIdQueryHandler,
  GetAllBpiSubjectsQueryHandler,
  GetBpiAccountByIdQueryHandler,
  GetAllBpiAccountsQueryHandler,
  GetBpiSubjectAccountByIdQueryHandler,
  GetAllBpiSubjectAccountsQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController, AccountController, SubjectAccountController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiSubjectAgent,
    BpiSubjectStorageAgent,
    BpiAccountAgent,
    BpiAccountStorageAgent,
    BpiSubjectAccountAgent,
    BpiSubjectAccountStorageAgent,
  ],
})
export class SubjectModule {}
