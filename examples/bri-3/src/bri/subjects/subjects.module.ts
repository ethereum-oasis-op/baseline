import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubjectController } from './controllers/subjects.controller';
import { CreateBpiSubjectCommandHandler } from './handlers/createBpiSubjectCommand.handler';

export const CommandHandlers = [CreateBpiSubjectCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [SubjectController],
  providers: [
    ...CommandHandlers
  ]
})
export class SubjectsModule {}
