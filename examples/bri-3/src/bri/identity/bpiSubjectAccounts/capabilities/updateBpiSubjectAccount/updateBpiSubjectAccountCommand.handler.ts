import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { UpdateBpiSubjectAccountCommand } from './updateBpiSubjectAccount.command';

@CommandHandler(UpdateBpiSubjectAccountCommand)
export class UpdateBpiSubjectAccountCommandHandler
  implements ICommandHandler<UpdateBpiSubjectAccountCommand>
{
  constructor(
    private agent: BpiSubjectAccountAgent,
    private storageAgent: BpiSubjectAccountStorageAgent,
  ) {}

  async execute(command: UpdateBpiSubjectAccountCommand) {
    const bpiSubjectAccountToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiSubjectAccount();

    await this.storageAgent.updateBpiSubjectAccount(bpiSubjectAccountToUpdate);
  }
}
