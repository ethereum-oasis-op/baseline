import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { CreateBpiSubjectCommand } from './createBpiSubject.command';
import { v4 } from 'uuid';

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
    );

    const newBpiSubject = await this.storageAgent.storeNewBpiSubject(
      newBpiSubjectCandidate,
    );

    const newPublicKeys = await Promise.all(
      command.publicKey.map(async (key) => {
        return await this.storageAgent.storePublicKey(
          v4(),
          key.type,
          key.value,
          newBpiSubject.id,
        );
      }),
    );

    return newBpiSubject.id;
  }
}
