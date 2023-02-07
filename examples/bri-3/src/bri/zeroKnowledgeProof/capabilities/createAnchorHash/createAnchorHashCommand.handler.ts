import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashStorageAgent } from '../../agents/anchorHashStorage.agent';
import { AnchorHashCCSMStorageAgent } from '../../agents/anchorHashCCSMStorage.agent';
import { CreateAnchorHashCommand } from './createAnchorHash.command';

@CommandHandler(CreateAnchorHashCommand)
export class CreateAnchorHashCommandHandler
  implements ICommandHandler<CreateAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly storageAgent: AnchorHashStorageAgent,
    private readonly ccsmStorageAgent: AnchorHashCCSMStorageAgent,
  ) {}

  async execute(command: CreateAnchorHashCommand) {
    const newAnchorHash = await this.agent.hashTheStateAndCreateNewAnchorHash(
      command.ownerAccount.id,
      command.state,
    );

    await this.storageAgent.storeNewAnchorHash(newAnchorHash);

    await this.ccsmStorageAgent.storeAnchorHashOnCCSM(newAnchorHash);

    return newAnchorHash;
  }
}
