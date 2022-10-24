import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { CreateBpiSubjectAccountCommand } from './createBpiSubjectAccount.command';

@CommandHandler(CreateBpiSubjectAccountCommand)
export class CreateBpiSubjectAccountCommandHandler
  implements ICommandHandler<CreateBpiSubjectAccountCommand>
{
  constructor(
    private agent: BpiSubjectAccountAgent,
    private storageAgent: BpiSubjectAccountStorageAgent,
  ) {}

  async execute(command: CreateBpiSubjectAccountCommand) {
    const { creatorBpiSubject, ownerBpiSubject } =
      await this.agent.getCreatorAndOwnerSubjectsAndThrowIfNotExist(
        command.creatorBpiSubjectId,
        command.ownerBpiSubjectId,
      );

    const newBpiSubjectAccountCandidate = this.agent.createNewBpiSubjectAccount(
      creatorBpiSubject,
      ownerBpiSubject,
    );

    const newBpiSubjectAccount =
      await this.storageAgent.createNewBpiSubjectAccount(
        newBpiSubjectAccountCandidate,
      );

    return newBpiSubjectAccount.id;
  }
}
