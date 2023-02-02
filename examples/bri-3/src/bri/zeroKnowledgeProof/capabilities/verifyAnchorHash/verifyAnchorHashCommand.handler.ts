import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashCCSMStorageAgent } from '../../agents/anchorHashCCSMStorage.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';
import { ANCHOR_HASH_ON_CCSM_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly ccsmStorageAgent: AnchorHashCCSMStorageAgent,
  ) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    const anchorHash = await this.ccsmStorageAgent.getAnchorHashFromCCSM(
      publicInputForProofVerification,
    );

    if (!anchorHash) {
      throw new NotFoundException(ANCHOR_HASH_ON_CCSM_NOT_FOUND_ERR_MESSAGE);
    }

    //Verify Anchor hash
    const verified = this.agent.verifyAnchorHash(
      anchorHash,
      publicInputForProofVerification,
    );

    return verified;
  }
}
