import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CcsmAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { CcsmAnchorHashStorageAgent } from '../../agents/ccsmAnchorHashStorage.agent';
import { VerifyCcsmAnchorHashCommand } from './verifyCcsmAnchorHash.command';
import { CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
@CommandHandler(VerifyCcsmAnchorHashCommand)
export class VerifyCcsmAnchorHashCommandHandler
  implements ICommandHandler<VerifyCcsmAnchorHashCommand>
{
  constructor(
    private readonly agent: CcsmAnchorHashAgent,
    private readonly storageAgent: CcsmAnchorHashStorageAgent,
  ) {}

  async execute(command: VerifyCcsmAnchorHashCommand) {
    this.agent.throwErrorIfCcsmAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    const CcsmAnchorHash = await this.storageAgent.getAnchorHashFromCcsm(
      publicInputForProofVerification,
    );

    if (!CcsmAnchorHash) {
      throw new NotFoundException(CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    //Verify Ccsm Anchor hash
    const verified = await this.agent.verifyCcsmAnchorHash(
      CcsmAnchorHash,
      publicInputForProofVerification,
    );

    //Check if the

    return verified;
  }
}
