import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';

@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(private agent: AnchorHashAgent) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const verified = await this.agent.verifyDocumentWithAnchorHash(
      command.inputForProofVerification,
    );

    return verified;
  }
}
