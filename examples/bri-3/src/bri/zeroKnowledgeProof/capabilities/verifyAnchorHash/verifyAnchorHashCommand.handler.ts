import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnchorHashAgent } from '../../agents/anchorHash.agent';
import { AnchorHashCcsmStorageAgent } from '../../agents/anchorHashCcsmStorage.agent';
import { VerifyAnchorHashCommand } from './verifyAnchorHash.command';
import { ANCHOR_HASH_ON_CCSM_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { AnchorHashStorageAgent } from '../../agents/anchorHashStorage.agent';
@CommandHandler(VerifyAnchorHashCommand)
export class VerifyAnchorHashCommandHandler
  implements ICommandHandler<VerifyAnchorHashCommand>
{
  constructor(
    private readonly agent: AnchorHashAgent,
    private readonly ccsmStorageAgent: AnchorHashCcsmStorageAgent,
    private readonly anchorHashStorageAgent: AnchorHashStorageAgent,
  ) {}

  async execute(command: VerifyAnchorHashCommand) {
    this.agent.throwErrorIfAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    this.agent.verifySignature(command.signature);

    const ccsmAnchorHash = await this.ccsmStorageAgent.getAnchorHashFromCcsm(
      publicInputForProofVerification,
    );

    if (!ccsmAnchorHash) {
      throw new NotFoundException(ANCHOR_HASH_ON_CCSM_NOT_FOUND_ERR_MESSAGE);
    }

    //Verify Anchor hash
    const verified = this.agent.verifyAnchorHash(
      ccsmAnchorHash,
      publicInputForProofVerification,
    );

    return verified;
  }
}
