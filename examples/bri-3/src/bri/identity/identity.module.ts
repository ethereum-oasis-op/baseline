import { Module } from '@nestjs/common';
import { AccountModule } from './bpiAccounts/accounts.module';
import { SubjectAccountModule } from './bpiSubjectAccounts/subjectAccounts.module';
import { SubjectModule } from './bpiSubjects/subjects.module';
import { IdentityProfileModule } from './identity.mapper.module';
import { IdentityProfile } from './identity.mapper.profile';

@Module({
  imports: [SubjectModule, SubjectAccountModule, AccountModule],
  providers: [IdentityProfileModule],
  exports: [IdentityProfileModule]
})
export class IdentityModule {}
