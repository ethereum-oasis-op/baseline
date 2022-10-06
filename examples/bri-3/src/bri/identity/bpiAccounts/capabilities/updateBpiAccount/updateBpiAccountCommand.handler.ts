import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiAccountAgent } from '../../agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { UpdateBpiAccountCommand } from './updateBpiAccount.command';

@CommandHandler(UpdateBpiAccountCommand)
export class UpdateBpiAccountCommandHandler
  implements ICommandHandler<UpdateBpiAccountCommand>
{
  constructor(
    private agent: BpiAccountAgent,
    private storageAgent: BpiAccountStorageAgent,
  ) {}

  async execute(command: UpdateBpiAccountCommand) {
    const bpiSubjectToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiAccount(bpiSubjectToUpdate, command.nonce);

    await this.storageAgent.updateBpiAccount(bpiSubjectToUpdate);
  }
}
