import { Module } from '@nestjs/common';
import { AccountModule } from './bpiAccounts/accounts.module';
import { SubjectAccountModule } from './bpiSubjectAccounts/subjectAccounts.module';
import { SubjectModule } from './bpiSubjects/subjects.module';

@Module({
  imports: [SubjectModule, SubjectAccountModule, AccountModule],
})
export class IdentityModule {}
