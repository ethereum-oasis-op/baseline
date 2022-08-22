import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubjectController } from './api/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './capabilities/createBpiSubject/createBpiSubjectCommand.handler';

export const CommandHandlers = [CreateBpiSubjectCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers
  ]
})
export class SubjectsModule {}
