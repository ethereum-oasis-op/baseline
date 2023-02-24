import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggingModule } from '../../shared/logging/logging.module';
import { AuthModule } from '../auth/auth.module';
import { SubjectModule } from '../identity/bpiSubjects/subjects.module';
import { SubjectsProfile } from '../identity/bpiSubjects/subjects.profile';
import { NatsMessagingClient } from './/messagingClients/natsMessagingClient';
import { BpiMessageAgent } from './agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from './agents/bpiMessagesStorage.agent';
import { MessagingAgent } from './agents/messaging.agent';
import { MessageController } from './api/messages.controller';
import { CreateBpiMessageCommandHandler } from './capabilities/createBpiMessage/createBpiMessageCommand.handler';
import { DeleteBpiMessageCommandHandler } from './capabilities/deleteBpiMessage/deleteBpiMessageCommand.handler';
import { GetBpiMessageByIdQueryHandler } from './capabilities/getBpiMessageById/getBpiMessageByIdQuery.handler';
import { ProcessInboundMessageCommandHandler } from './capabilities/processInboundMessage/processInboundMessageCommand.handler';
import { UpdateBpiMessageCommandHandler } from './capabilities/updateBpiMessage/updateBpiMessageCommand.handler';
import { CommunicationProfile } from './communicaton.profile';

export const CommandHandlers = [
  CreateBpiMessageCommandHandler,
  UpdateBpiMessageCommandHandler,
  DeleteBpiMessageCommandHandler,
  ProcessInboundMessageCommandHandler,
];
export const QueryHandlers = [GetBpiMessageByIdQueryHandler];

@Module({
  imports: [CqrsModule, AuthModule, SubjectModule, LoggingModule],
  controllers: [MessageController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiMessageAgent,
    BpiMessageStorageAgent,
    MessagingAgent,
    SubjectsProfile,
    CommunicationProfile,
    {
      provide: 'IMessagingClient',
      useClass: NatsMessagingClient,
    },
  ],
})
export class CommunicationModule {}
