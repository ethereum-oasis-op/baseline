import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MerkleTreeAgent } from '../../agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from '../../agents/merkleTreeStorage.agent';
import { CreateMerkleTreeCommand } from './createMerkleTree.command';

@CommandHandler(CreateMerkleTreeCommand)
export class CreateMerkleTreeCommandHandler
  implements ICommandHandler<CreateMerkleTreeCommand>
{
  constructor(
    private readonly agent: MerkleTreeAgent,
    private readonly storageAgent: MerkleTreeStorageAgent,
  ) {}

  async execute(command: CreateMerkleTreeCommand) {
    const newMerkleTreeCandidate = this.agent.createNewMerkleTree(
      command.leaves,
      command.hashAlgName,
    );

    const newMerkleTree = await this.storageAgent.storeNewMerkleTree(
      newMerkleTreeCandidate,
    );

    return newMerkleTree.id;
  }
}
