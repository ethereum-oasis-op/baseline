import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CCSMAnchorAgent } from '../../agents/ccsmAnchor.agent';
import { VerifyCCSMAnchorCommand } from './verifyCCSMAnchor.command';

@CommandHandler(VerifyCCSMAnchorCommand)
export class VerifyCCSMAnchorCommandHandler
  implements ICommandHandler<VerifyCCSMAnchorCommand>
{
  constructor(private readonly agent: CCSMAnchorAgent) {}

  async execute(command: VerifyCCSMAnchorCommand) {
    this.agent.throwErrorIfCCSMAnchorInputInvalid(
      command.inputForProofVerification,
    );

    const verified = await this.agent.verifyDocumentWithCCSMAnchor(
      command.inputForProofVerification,
    );

    return verified;
  }
}
