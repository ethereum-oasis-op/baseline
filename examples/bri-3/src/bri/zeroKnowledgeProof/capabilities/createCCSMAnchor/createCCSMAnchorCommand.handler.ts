import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CCSMAnchorAgent } from '../../agents/ccsmAnchor.agent';
import { CCSMAnchorStorageAgent } from '../../agents/ccsmAnchorStorage.agent';
import { CreateCCSMAnchorCommand } from './createCCSMAnchor.command';

@CommandHandler(CreateCCSMAnchorCommand)
export class CreateCCSMAnchorCommandHandler
  implements ICommandHandler<CreateCCSMAnchorCommand>
{
  constructor(
    private agent: CCSMAnchorAgent,
    private storageAgent: CCSMAnchorStorageAgent,
  ) {}

  async execute(command: CreateCCSMAnchorCommand) {
    this.agent.throwErrorIfCCSMAnchorInputInvalid(command.document);

    const newCCSMAnchor = this.agent.createNewCCSMAnchor(
      command.ownerAccount,
      command.agreementState,
      command.document,
      command.signature,
    );

    await this.storageAgent.storeCCSMAnchorOnCCSM(newCCSMAnchor);

    return newCCSMAnchor;
  }
}
