import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/AnchorHash.agent';
import { AnchorHashStorageAgent } from '../../agents/AnchorHashStorage.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';
import { ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly storageAgent: AnchorHashStorageAgent,
  ) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    const AnchorHash = await this.storageAgent.getAnchorHashFrom(
      publicInputForProofVerification,
    );

    if (!AnchorHash) {
      throw new NotFoundException(ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    //Verify  Anchor hash
    const verified = this.agent.verifyAnchorHash(
      AnchorHash,
      publicInputForProofVerification,
    );

    return verified;
  }
}
