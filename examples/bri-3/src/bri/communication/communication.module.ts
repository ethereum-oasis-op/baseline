import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubjectModule } from '../identity/bpiSubjects/subjects.module';
import { SubjectsProfile } from '../identity/bpiSubjects/subjects.profile';
import { NatsMessagingClient } from './/messagingClients/natsMessagingClient';
import { BpiMessageAgent } from './agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from './agents/bpiMessagesStorage.agent';
import { MessagingListenerAgent } from './agents/messagingListener.agent';
import { MessageController } from './api/messages.controller';
import { CreateBpiMessageCommandHandler } from './capabilities/createBpiMessage/createBpiMessageCommand.handler';
import { DeleteBpiMessageCommandHandler } from './capabilities/deleteBpiMessage/deleteBpiMessageCommand.handler';
import { GetBpiMessageByIdQueryHandler } from './capabilities/getBpiMessageById/getBpiMessageByIdQuery.handler';
import { UpdateBpiMessageCommandHandler } from './capabilities/updateBpiMessage/updateBpiMessageCommand.handler';
import { CommunicationProfile } from './communicaton.profile';

export const CommandHandlers = [
  CreateBpiMessageCommandHandler,
  UpdateBpiMessageCommandHandler,
  DeleteBpiMessageCommandHandler,
];
export const QueryHandlers = [GetBpiMessageByIdQueryHandler];

@Module({
  imports: [CqrsModule, SubjectModule],
  controllers: [MessageController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiMessageAgent,
    BpiMessageStorageAgent,
    MessagingListenerAgent,
    SubjectsProfile,
    CommunicationProfile,
    {
      provide: 'IMessagingClient',
      useClass: NatsMessagingClient // TODO: This is the place where we would inject different clients based on configuration (i.e. RabbitMQ client)
    }
  ],
})
export class CommunicationModule {}
