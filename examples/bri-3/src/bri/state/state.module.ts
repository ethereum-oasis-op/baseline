import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountModule } from '../identity/bpiAccounts/accounts.module';
import { MerkleModule } from '../merkleTree/merkle.module';
import { StateAgent } from './agents/state.agent';

@Module({
  imports: [CqrsModule, MerkleModule, AccountModule],
  providers: [StateAgent],
  exports: [StateAgent],
})
export class StateModule {}
