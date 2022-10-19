import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { DeleteBpiSubjectAccountCommand } from './deleteBpiSubjectAccount.command';

@CommandHandler(DeleteBpiSubjectAccountCommand)
export class DeleteBpiSubjectAccountCommandHandler
  implements ICommandHandler<DeleteBpiSubjectAccountCommand>
{
  constructor(
    private agent: BpiSubjectAccountAgent,
    private storageAgent: BpiSubjectAccountStorageAgent,
  ) {}

  async execute(command: DeleteBpiSubjectAccountCommand) {
    const bpiSubjectAccountToDelete =
      await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(
        command.id,
      );
    await this.storageAgent.deleteBpiSubjectAccount(bpiSubjectAccountToDelete);
  }
}
