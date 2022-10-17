import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { BpiSubject } from '../../models/bpiSubject';
import { UpdateBpiSubjectCommand } from './updateBpiSubject.command';

@CommandHandler(UpdateBpiSubjectCommand)
export class UpdateBpiSubjectCommandHandler
  implements ICommandHandler<UpdateBpiSubjectCommand>
{
  constructor(
    private agent: BpiSubjectAgent,
    private storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(command: UpdateBpiSubjectCommand) {
    const bpiSubjectToUpdate: BpiSubject =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiSubject(
      bpiSubjectToUpdate,
      command.name,
      command.description,
      command.publicKey,
    );

    return await this.storageAgent.updateBpiSubject(bpiSubjectToUpdate);
  }
}
