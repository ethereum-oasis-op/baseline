import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProofAgent } from '../../agents/proof.agent';
import { ProofStorageAgent } from '../../agents/proofStorage.agent';
import { VerifyProofCommand } from './verifyProof.command';

@CommandHandler(VerifyProofCommand)
export class VerifyProofCommandHandler
  implements ICommandHandler<VerifyProofCommand>
{
  constructor(
    private agent: ProofAgent,
    private storageAgent: ProofStorageAgent,
  ) {}

  async execute(command: VerifyProofCommand) {
    this.agent.throwIfProofInputInvalid(command.document);

    const verified = await this.agent.verifyDocumentWithProof(command.document);

    return verified;
  }
}
