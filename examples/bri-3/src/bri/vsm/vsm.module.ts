import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingModule } from '../../shared/logging/logging.module';
import { StateModule } from '../state/state.module';
import { TransactionModule } from '../transactions/transactions.module';
import { WorkflowModule } from '../workgroup/workflows/workflows.module';
import { WorkstepModule } from '../workgroup/worksteps/worksteps.module';
import { VsmTasksSchedulerAgent } from './agents/vsmTaskScheduler.agent';
import { ExecuteVsmCycleCommandHandler } from './capabilites/executeVsmCycle/executeVsmCycleCommand.handler';
import { MessagingAgent } from '../communication/agents/messaging.agent';
import { WorkstepExecutedEventHandler } from './capabilites/handleWorkstepEvents/workstepExecutedEvent.handler';
import { NatsMessagingClient } from '../communication/messagingClients/natsMessagingClient';

export const CommandHandlers = [
  ExecuteVsmCycleCommandHandler,
  WorkstepExecutedEventHandler,
];

export const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    ScheduleModule.forRoot(),
    TransactionModule,
    LoggingModule,
    WorkstepModule,
    WorkflowModule,
    StateModule,
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
