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

    //TODO get policies from db to pass to create below
    const authenticationPolicy = '';
    const authorizationPolicy = '';
    const verifiableCredential = '';
    const recoveryKey = '';

    const newBpiSubjectAccountCandidate = this.agent.createNewBpiSubjectAccount(
      creatorBpiSubject,
      ownerBpiSubject,
      authenticationPolicy,
      authorizationPolicy,
      verifiableCredential,
      recoveryKey,
    );

    const newBpiSubjectAccount =
      await this.storageAgent.storeNewBpiSubjectAccount(
        newBpiSubjectAccountCandidate,
      );

    return newBpiSubjectAccount.id;
  }
}
