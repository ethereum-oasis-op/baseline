import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MerkleTreeAgent } from '../../agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from '../../agents/merkleTreeStorage.agent';
import { DeleteMerkleTreeCommand } from './deleteMerkleTree.command';

@CommandHandler(DeleteMerkleTreeCommand)
export class DeleteMerkleTreeCommandHandler
  implements ICommandHandler<DeleteMerkleTreeCommand>
{
  constructor(
    private readonly agent: MerkleTreeAgent,
    private readonly storageAgent: MerkleTreeStorageAgent,
  ) {}

  async execute(command: DeleteMerkleTreeCommand) {
    const merkleTreeToDelete =
      await this.agent.fetchMerkleTreeCandidateByIdAndThrowIfValidationFails(
        command.id,
      );
    await this.storageAgent.deleteMerkleTree(merkleTreeToDelete);
  }
}
