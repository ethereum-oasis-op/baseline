import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../../shared/prisma/prisma.module';
import { AuthzModule } from '../../authz/authz.module';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from './agents/bpiSubjectsStorage.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { DeleteBpiSubjectCommandHandler } from './capabilities/deleteBpiSubject/deleteBpiSubjectCommand.handler';
import { GetAllBpiSubjectsQueryHandler } from './capabilities/getAllBpiSubjects/getAllBpiSubjectsQuery.handler';
import { GetBpiSubjectByIdQueryHandler } from './capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from './capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { SubjectsProfile } from './subjects.profile';

export const CommandHandlers = [
  CreateBpiSubjectCommandHandler,
  UpdateBpiSubjectCommandHandler,
  DeleteBpiSubjectCommandHandler,
];
export const QueryHandlers = [
  GetBpiSubjectByIdQueryHandler,
  GetAllBpiSubjectsQueryHandler,
];

@Module({
  imports: [CqrsModule, AuthzModule, PrismaModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiSubjectAgent,
    BpiSubjectStorageAgent,
    SubjectsProfile,
  ],
  exports: [BpiSubjectAgent, BpiSubjectStorageAgent],
})
export class SubjectModule {}
