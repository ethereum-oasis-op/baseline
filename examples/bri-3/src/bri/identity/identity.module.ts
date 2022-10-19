import { Module } from '@nestjs/common';
import { AccountModule } from './bpiAccounts/accounts.module';
import { SubjectAccountModule } from './bpiSubjectAccounts/subjectAccounts.module';
import { SubjectModule } from './bpiSubjects/subjects.module';
import { IdentityProfileModule } from './identity.mapper.module';

@Module({
  imports: [SubjectModule, SubjectAccountModule, AccountModule, IdentityProfileModule],
})
export class IdentityModule {}
