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
import { NatsMessagingClient } from '../communication/messagingClients/natsMessagingClient';

export const CommandHandlers = [
  ExecuteVsmCycleCommandHandler,
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
  ],
  providers: [
    VsmTasksSchedulerAgent,
    ...CommandHandlers,
    ...QueryHandlers,
    MessagingAgent,
    {
      provide: 'IMessagingClient',
      useClass: NatsMessagingClient,
    },
  ],
})
export class VsmModule {}
