import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/AnchorHash.agent';
import { AnchorHashStorageAgent } from '../../agents/AnchorHashStorage.agent';
import { AnchorHashLocalStorageAgent } from '../../agents/AnchorHashLocalStorage.agent';
import { CreateAnchorHashCommand } from './createAnchorHash.command';

@CommandHandler(CreateAnchorHashCommand)
export class CreateAnchorHashCommandHandler
  implements ICommandHandler<CreateAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly StorageAgent: AnchorHashStorageAgent,
    private readonly localStorageAgent: AnchorHashLocalStorageAgent,
  ) {}

  async execute(command: CreateAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(command.state);

    const newState = await this.localStorageAgent.createNewState(command.state);

    const newAnchorHash = await this.agent.hashTheStateAndCreateNewAnchorHash(
      command.ownerAccount.id,
      newState,
    );

    await this.localStorageAgent.createNewAnchorHash(newAnchorHash);

    await this.StorageAgent.storeAnchorHashOn(newAnchorHash);

    return newAnchorHash;
  }
}
