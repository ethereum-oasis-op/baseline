import { Module } from '@nestjs/common';
import { AccountsModule } from './bpiAccounts/accounts.module';
import { SubjectAccountsModule } from './bpiSubjectAccounts/subjectAccounts.module';
import { SubjectsModule } from './bpiSubjects/subjects.module';

@Module({
  imports: [
    SubjectsModule, 
    SubjectAccountsModule, 
    AccountsModule
  ]
})
export class IdentityModule {}
