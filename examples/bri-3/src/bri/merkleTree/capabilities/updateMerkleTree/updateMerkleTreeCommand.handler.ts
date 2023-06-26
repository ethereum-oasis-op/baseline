import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { MerkleTreeAgent } from '../../agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from '../../agents/merkleTreeStorage.agent';
import { UpdateMerkleTreeCommand } from './updateMerkleTree.command';
import { BpiMerkleTree } from '../../models/bpiMerkleTree';

@CommandHandler(UpdateMerkleTreeCommand)
export class UpdateMerkleTreeCommandHandler
  implements ICommandHandler<UpdateMerkleTreeCommand>
{
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly agent: MerkleTreeAgent,
    private readonly storageAgent: MerkleTreeStorageAgent,
  ) {}

  async execute(command: UpdateMerkleTreeCommand) {
    const merkleTreeUpdateCandidate =
      await this.agent.fetchMerkleTreeByIdAndThrowIfValidationFails(command.id);

    this.agent.updateMerkleTree(
      merkleTreeUpdateCandidate,
      command.leaves,
      command.hashAlgName,
    );

    const newMerkleTree = await this.storageAgent.storeUpdatedMerkleTree(
      merkleTreeUpdateCandidate,
    );

    return this.mapper.map(newMerkleTree, BpiMerkleTree, BpiMerkleTree);
  }
}
