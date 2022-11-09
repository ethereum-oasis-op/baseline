import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashStorageAgent } from '../../agents/anchorHashStorage.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';

@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(
    private agent: AnchorHashAgent,
    private storageAgent: AnchorHashStorageAgent,
  ) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(command.document);

    const verified = await this.agent.verifyDocumentWithAnchorHash(
      command.document,
    );

    return verified;
  }
}
