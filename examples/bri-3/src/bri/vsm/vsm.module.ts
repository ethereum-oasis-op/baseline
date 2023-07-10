import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { VsmTasksSchedulerAgent } from './agents/vsmTaskScheduler.agent';
import { LoggingModule } from 'src/shared/logging/logging.module';
import { ExecuteVsmCycleCommandHandler } from './capabilites/executeVsmCycle/executeVsmCycleCommand.handler';
import { TransactionModule } from '../transactions/transactions.module';

export const CommandHandlers = [ExecuteVsmCycleCommandHandler];

export const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    ScheduleModule.forRoot(),
    TransactionModule,
    LoggingModule,
  ],
  providers: [VsmTasksSchedulerAgent, ...CommandHandlers, ...QueryHandlers],
})
export class VsmModule {}
