import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingModule } from '../../shared/logging/logging.module';
import { TransactionModule } from '../transactions/transactions.module';
import { WorkstepModule } from '../workgroup/worksteps/worksteps.module';
import { VsmTasksSchedulerAgent } from './agents/vsmTaskScheduler.agent';
import { ExecuteVsmCycleCommandHandler } from './capabilites/executeVsmCycle/executeVsmCycleCommand.handler';
import { MessagingAgent } from '../communication/agents/messaging.agent';
import { WorkstepExecutionFailuresHandler } from './capabilites/handleWorkstepFailuresEvents/workstepExecutionFailures.handler';
import { HandleWorkstepFailuresCommandHandler } from './capabilites/handleWorkstepFailures/handleWorkstepFailuresCommand.handler';
import { VsmFailureSagas } from './capabilites/sagas/vsmFailures.sagas';

export const CommandHandlers = [
  ExecuteVsmCycleCommandHandler,
  HandleWorkstepFailuresCommandHandler,
  WorkstepExecutionFailuresHandler,
];

export const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    ScheduleModule.forRoot(),
    TransactionModule,
    LoggingModule,
    WorkstepModule,
    MessagingAgent,
    VsmFailureSagas,
  ],
  providers: [VsmTasksSchedulerAgent, ...CommandHandlers, ...QueryHandlers],
})
export class VsmModule {}
