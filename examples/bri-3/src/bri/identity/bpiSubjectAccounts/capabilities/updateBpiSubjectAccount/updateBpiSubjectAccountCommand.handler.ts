import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountDto } from '../../api/dtos/response/bpiSubjectAccount.dto';
import { BpiSubjectAccount } from '../../models/bpiSubjectAccount';
import { UpdateBpiSubjectAccountCommand } from './updateBpiSubjectAccount.command';

@CommandHandler(UpdateBpiSubjectAccountCommand)
export class UpdateBpiSubjectAccountCommandHandler
  implements ICommandHandler<UpdateBpiSubjectAccountCommand>
{
  constructor(
    private agent: BpiSubjectAccountAgent,
    private storageAgent: BpiSubjectAccountStorageAgent,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async execute(command: UpdateBpiSubjectAccountCommand) {
    const bpiSubjectAccountToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiSubjectAccount();

    const updatedBpiSubjectAccount =
      await this.storageAgent.updateBpiSubjectAccount(
        bpiSubjectAccountToUpdate,
      );

    return this.mapper.map(
      updatedBpiSubjectAccount,
      BpiSubjectAccount,
      BpiSubjectAccountDto,
    );
  }
}
