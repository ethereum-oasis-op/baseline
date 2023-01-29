import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { CreateBpiSubjectCommand } from './createBpiSubject.command';

@CommandHandler(CreateBpiSubjectCommand)
export class CreateBpiSubjectCommandHandler
  implements ICommandHandler<CreateBpiSubjectCommand>
{
  constructor(
    private readonly agent: BpiSubjectAgent,
    private readonly storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(command: CreateBpiSubjectCommand) {
    this.agent.throwIfCreateBpiSubjectInputInvalid(command.name);

    const newBpiSubjectCandidate = await this.agent.createNewExternalBpiSubject(
      command.name,
      command.description,
      command.publicKey,
    );

    const newBpiSubject = await this.storageAgent.createNewBpiSubject(
      newBpiSubjectCandidate,
    );

    return newBpiSubject.id;
  }
}
