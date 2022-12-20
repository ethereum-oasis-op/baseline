import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CCSMAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { CCSMAnchorHashStorageAgent } from '../../agents/ccsmAnchorHashStorage.agent';
import { CreateCCSMAnchorHashCommand } from './createCCSMAnchorHash.command';

@CommandHandler(CreateCCSMAnchorHashCommand)
export class CreateCCSMAnchorHashCommandHandler
  implements ICommandHandler<CreateCCSMAnchorHashCommand>
{
  constructor(
    private readonly agent: CCSMAnchorHashAgent,
    private readonly storageAgent: CCSMAnchorHashStorageAgent,
  ) {}

  async execute(command: CreateCCSMAnchorHashCommand) {
    this.agent.throwErrorIfCCSMAnchorHashInputInvalid(command.document);

    const newCCSMAnchorHash = this.agent.createNewCCSMAnchorHash(
      command.ownerAccount.id,
      command.document,
    );

    await this.storageAgent.storeAnchorHashOnCCSM(newCCSMAnchorHash);

    return newCCSMAnchorHash;
  }
}
