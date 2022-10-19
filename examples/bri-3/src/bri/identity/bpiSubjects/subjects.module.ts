import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BpiSubjectAgent } from './agents/bpiSubjects.agent';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { DeleteBpiSubjectCommandHandler } from './capabilities/deleteBpiSubject/deleteBpiSubjectCommand.handler';
import { GetAllBpiSubjectsQueryHandler } from './capabilities/getAllBpiSubjects/getAllBpiSubjectsQuery.handler';
import { GetBpiSubjectByIdQueryHandler } from './capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from './capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { BpiSubjectStorageAgent } from './agents/bpiSubjectsStorage.agent';
import Mapper from '../../utils/mapper';
import { IdentityProfileModule } from '../identity.mapper.module';
import { IdentityProfile } from '../identity.mapper.profile';

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
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    BpiSubjectAgent,
    BpiSubjectStorageAgent,
    Mapper
  ],
  exports: [BpiSubjectStorageAgent],
})
export class SubjectModule {}
