import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MerkleModule } from '../merkleTree/merkle.module';
import { StateAgent } from './agents/state.agent';
import { StateController } from './api/state.controller';
import { AccountModule } from './bpiAccounts/accounts.module';
import { GetStateTreeLeafValueContentQueryHandler } from './capabilities/getStateContent/getStateTreeLeafValueContentQuery.handler';
import { StateProfile } from './state.profile';

export const QueryHandlers = [GetStateTreeLeafValueContentQueryHandler];

@Module({
  imports: [CqrsModule, MerkleModule, AccountModule],
  controllers: [StateController],
  providers: [...QueryHandlers, StateAgent, StateProfile],
  exports: [StateAgent],
})
export class StateModule {}
