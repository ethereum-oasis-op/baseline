import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubjectModule } from '../bpiSubjects/subjects.module';
import { BpiSubjectAccountAgent } from './agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from './agents/bpiSubjectAccountsStorage.agent';
import { SubjectAccountController } from './api/subjectAccounts.controller';
import { CreateBpiSubjectAccountCommandHandler } from './capabilities/createBpiSubjectAccount/createBpiSubjectAccountCommand.handler';
import { DeleteBpiSubjectAccountCommandHandler } from './capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccountCommand.handler';
import { GetAllBpiSubjectAccountsQueryHandler } from './capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccountsQuery.handler';
import { GetBpiSubjectAccountByIdQueryHandler } from './capabilities/getBpiSubjectAccountById/getBpiSubjectAccountByIdQuery.handler';
import { UpdateBpiSubjectAccountCommandHandler } from './capabilities/updateBpiSubjectAccount/updateBpiSubjectAccountCommand.handler';
import { SubjectAccountsProfile } from './subject.accounts.profile';

export const CommandHandlers = [
  CreateBpiSubjectAccountCommandHandler,
  UpdateBpiSubjectAccountCommandHandler,
  DeleteBpiSubjectAccountCommandHandler,
];
export const QueryHandlers = [
  GetBpiSubjectAccountByIdQueryHandler,
  GetAllBpiSubjectAccountsQueryHandler,
];

@Module({
  imports: [CqrsModule, SubjectModule],
  controllers: [SubjectAccountController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiSubjectAccountAgent,
    BpiSubjectAccountStorageAgent,
    SubjectAccountsProfile
  ],
  exports: [BpiSubjectAccountAgent],
})
export class SubjectAccountModule {}
