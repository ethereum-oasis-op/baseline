import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CcsmAnchorHashAgent } from '../../agents/ccsmAnchorHash.agent';
import { CcsmAnchorHashStorageAgent } from '../../agents/ccsmAnchorHashStorage.agent';
import { VerifyCcsmAnchorHashCommand } from './verifyCcsmAnchorHash.command';

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

    //Create public input for proof verification
    const hash = this.agent.convertDocumentToHash(
      command.inputForProofVerification,
    );
    const publicInputForProofVerification = hash;

    //Get Anchor hash if it exists on Ccsm
    const CcsmAnchorHash = await this.storageAgent.getAnchorHashFromCcsm(
      publicInputForProofVerification,
    );

    //Verify Ccsm Anchor hash
    const verified = await this.agent.verifyCcsmAnchorHash(
      CcsmAnchorHash,
      publicInputForProofVerification,
    );

    //Check if the

    return verified;
  }
}
