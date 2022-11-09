import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashStorageAgent } from '../../agents/anchorHashStorage.agent';
import { CreateAnchorHashCommand } from './createAnchorHash.command';

@CommandHandler(CreateAnchorHashCommand)
export class CreateAnchorHashCommandHandler
  implements ICommandHandler<CreateAnchorHashCommand>
{
  constructor(
    private agent: AnchorHashAgent,
    private storageAgent: AnchorHashStorageAgent,
  ) {}

  async execute(command: CreateAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(command.document);

    const newAnchorHash = this.agent.createNewAnchorHash(
      command.ownerAccount,
      command.agreementState,
      command.document,
      command.signature,
    );

    await this.storageAgent.storeAnchorHashOnchain(newAnchorHash);

    return newAnchorHash;
  }
}
