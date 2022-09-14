import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { GetBpiSubjectByIdQueryHandler } from './capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from './capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { BpiSubjectRepository } from './persistence/bpiSubjects.repository';

export const CommandHandlers = [CreateBpiSubjectCommandHandler, UpdateBpiSubjectCommandHandler];
export const QueryHandlers = [GetBpiSubjectByIdQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers, 
    ...QueryHandlers,
    BpiSubjectAgent, 
    BpiSubjectRepository
  ]
})
export class SubjectsModule {}
