import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CcsmAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { CcsmAnchorHashStorageAgent } from '../../agents/ccsmAnchorHashStorage.agent';
import { CreateCcsmAnchorHashCommand } from './createCcsmAnchorHash.command';

@CommandHandler(CreateCcsmAnchorHashCommand)
export class CreateCcsmAnchorHashCommandHandler
  implements ICommandHandler<CreateCcsmAnchorHashCommand>
{
  constructor(
    private readonly agent: CcsmAnchorHashAgent,
    private readonly storageAgent: CcsmAnchorHashStorageAgent,
  ) {}

  async execute(command: CreateCcsmAnchorHashCommand) {
    this.agent.throwErrorIfCcsmAnchorHashInputInvalid(command.document);

    const newCcsmAnchorHash = this.agent.createNewCcsmAnchorHash(
      command.ownerAccount.id,
      command.document,
    );

    await this.storageAgent.storeAnchorHashOnCcsm(newCcsmAnchorHash);

    return newCcsmAnchorHash;
  }
}
