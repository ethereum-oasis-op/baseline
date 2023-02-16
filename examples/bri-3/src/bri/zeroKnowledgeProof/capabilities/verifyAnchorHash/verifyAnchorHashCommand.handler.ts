import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashCcsmStorageAgent } from '../../agents/anchorHashCcsmStorage.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';
import { ANCHOR_HASH_ON_CCSM_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';

@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly ccsmStorageAgent: AnchorHashCcsmStorageAgent,
  ) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    this.agent.verifyAnchorHashSignature(command.signature);

    const anchorHash = await this.ccsmStorageAgent.getAnchorHashFromCcsm(
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
