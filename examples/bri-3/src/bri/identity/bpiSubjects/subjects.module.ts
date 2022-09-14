import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { DeleteBpiSubjectCommandHandler } from './capabilities/deleteBpiSubject/updateBpiSubjectCommand.handler';
import { GetAllBpiSubjectsQuery } from './capabilities/getAllBpiSubjects/getAllBpiSubjects.query';
import { GetBpiSubjectByIdQueryHandler } from './capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from './capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { BpiSubjectRepository } from './persistence/bpiSubjects.repository';

export const CommandHandlers = [
  CreateBpiSubjectCommandHandler, 
  UpdateBpiSubjectCommandHandler,
  DeleteBpiSubjectCommandHandler];
export const QueryHandlers = [
  GetBpiSubjectByIdQueryHandler,
  GetAllBpiSubjectsQuery];

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
