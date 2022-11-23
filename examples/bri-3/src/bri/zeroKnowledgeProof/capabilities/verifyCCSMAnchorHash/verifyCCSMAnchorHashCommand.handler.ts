import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CCSMAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { VerifyCCSMAnchorHashCommand } from './verifyCCSMAnchorHash.command';

@CommandHandler(VerifyCCSMAnchorHashCommand)
export class VerifyCCSMAnchorHashCommandHandler
  implements ICommandHandler<VerifyCCSMAnchorHashCommand>
{
  constructor(private readonly agent: CCSMAnchorHashAgent) {}

  async execute(command: VerifyCCSMAnchorHashCommand) {
    this.agent.throwErrorIfCCSMAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const verified = await this.agent.verifyDocumentWithCCSMAnchorHash(
      command.inputForProofVerification,
    );

    return verified;
  }
}
