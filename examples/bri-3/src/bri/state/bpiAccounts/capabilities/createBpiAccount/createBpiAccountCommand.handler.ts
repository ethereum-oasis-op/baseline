import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiAccountAgent } from '../../agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { CreateBpiAccountCommand } from './createBpiAccount.command';

@CommandHandler(CreateBpiAccountCommand)
export class CreateBpiAccountCommandHandler
  implements ICommandHandler<CreateBpiAccountCommand>
{
  constructor(
    private accountAgent: BpiAccountAgent,
    private accountStorageAgent: BpiAccountStorageAgent,
    private subjectAccountAgent: BpiSubjectAccountAgent,
  ) {}

  async execute(command: CreateBpiAccountCommand) {
    const ownerBpiSubjectAccounts =
      await this.subjectAccountAgent.getBpiSubjectAccountsAndThrowIfNotExist(
        command.ownerBpiSubjectAccountsIds,
      );

    const newBpiAccountCandidate = this.accountAgent.createNewBpiAccount(
      ownerBpiSubjectAccounts,
      'sample authorization condition',
      'sample state object prover system',
    );

    const newBpiAccount = await this.accountStorageAgent.storeNewBpiAccount(
      newBpiAccountCandidate,
    );
    return newBpiAccount.id;
  }
}
