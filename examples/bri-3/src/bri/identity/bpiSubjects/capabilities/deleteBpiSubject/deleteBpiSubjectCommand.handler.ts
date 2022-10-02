import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { DeleteBpiSubjectCommand } from './deleteBpiSubject.command';

@CommandHandler(DeleteBpiSubjectCommand)
export class DeleteBpiSubjectCommandHandler
  implements ICommandHandler<DeleteBpiSubjectCommand>
{
  constructor(
    private agent: BpiSubjectAgent,
    private storageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(command: DeleteBpiSubjectCommand) {
    const bpiSubjectToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );
    await this.storageAgent.deleteBpiSubject(bpiSubjectToDelete);
  }
}
