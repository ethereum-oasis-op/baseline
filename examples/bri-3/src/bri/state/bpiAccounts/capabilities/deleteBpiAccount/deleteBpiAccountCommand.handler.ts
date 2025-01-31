import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiAccountAgent } from '../../agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { DeleteBpiAccountCommand } from './deleteBpiAccount.command';

@CommandHandler(DeleteBpiAccountCommand)
export class DeleteBpiAccountCommandHandler
  implements ICommandHandler<DeleteBpiAccountCommand>
{
  constructor(
    private agent: BpiAccountAgent,
    private storageAgent: BpiAccountStorageAgent,
  ) {}

  async execute(command: DeleteBpiAccountCommand) {
    const bpiSubjectToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );
    await this.storageAgent.deleteBpiAccount(bpiSubjectToDelete);
  }
}
