import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CCSMAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { CCSMAnchorHashStorageAgent } from '../../agents/ccsmAnchorHashStorage.agent';
import { VerifyCCSMAnchorHashCommand } from './verifyCCSMAnchorHash.command';
import { CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
@CommandHandler(VerifyCCSMAnchorHashCommand)
export class VerifyCCSMAnchorHashCommandHandler
  implements ICommandHandler<VerifyCCSMAnchorHashCommand>
{
  constructor(
    private readonly agent: CCSMAnchorHashAgent,
    private readonly storageAgent: CCSMAnchorHashStorageAgent,
  ) {}

  async execute(command: VerifyCCSMAnchorHashCommand) {
    this.agent.throwErrorIfCCSMAnchorHashInputInvalid(
      command.inputForProofVerification,
    );

    const publicInputForProofVerification =
      this.agent.createPublicInputForProofVerification(
        command.inputForProofVerification,
      );

    const CCSMAnchorHash = await this.storageAgent.getAnchorHashFromCCSM(
      publicInputForProofVerification,
    );

    if (!CCSMAnchorHash) {
      throw new NotFoundException(CCSM_ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    //Verify CCSM Anchor hash
    const verified = this.agent.verifyCCSMAnchorHash(
      CCSMAnchorHash,
      publicInputForProofVerification,
    );

    //Check if the

    return verified;
  }
}
