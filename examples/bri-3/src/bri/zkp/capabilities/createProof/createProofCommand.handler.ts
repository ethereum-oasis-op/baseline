import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProofAgent } from '../../agents/proof.agent';
import { ProofStorageAgent } from '../../agents/proofStorage.agent';
import { CreateProofCommand } from './createProof.command';

@CommandHandler(CreateProofCommand)
export class CreateProofCommandHandler
  implements ICommandHandler<CreateProofCommand>
{
  constructor(
    private agent: ProofAgent,
    private storageAgent: ProofStorageAgent,
  ) {}

  async execute(command: CreateProofCommand) {
    this.agent.throwIfProofInputInvalid(command.document);

    const newProof = this.agent.createNewProof(
      command.id,
      null, // TODO: Fetch BpiAccount based on id ,
      command.document,
      command.signature,
    );

    await this.storageAgent.storeProofInShieldContract(newProof);

    return newProof.id;
  }
}
