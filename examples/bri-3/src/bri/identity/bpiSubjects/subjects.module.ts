import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';

export const CommandHandlers = [CreateBpiSubjectCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers, BpiSubjectAgent
  ]
})
export class SubjectsModule {}
