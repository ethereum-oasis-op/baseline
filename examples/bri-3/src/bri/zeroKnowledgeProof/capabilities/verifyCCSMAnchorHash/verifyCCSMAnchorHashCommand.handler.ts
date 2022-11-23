import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CcsmAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { VerifyCcsmAnchorHashCommand } from './verifyCcsmAnchorHash.command';

@CommandHandler(VerifyCcsmAnchorHashCommand)
export class VerifyCcsmAnchorHashCommandHandler
  implements ICommandHandler<VerifyCcsmAnchorHashCommand>
{
  constructor(private readonly agent: CcsmAnchorHashAgent) {}

  async execute(command: VerifyCcsmAnchorHashCommand) {
    this.agent.throwErrorIfCcsmAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const verified = await this.agent.verifyDocumentWithCcsmAnchorHash(
      command.inputForProofVerification,
    );

    return verified;
  }
}
