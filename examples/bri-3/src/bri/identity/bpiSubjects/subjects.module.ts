import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { BpiSubjectRepository } from './persistence/bpiSubjects.repository';

export const CommandHandlers = [CreateBpiSubjectCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers, BpiSubjectAgent, BpiSubjectRepository
  ]
})
export class SubjectsModule {}
