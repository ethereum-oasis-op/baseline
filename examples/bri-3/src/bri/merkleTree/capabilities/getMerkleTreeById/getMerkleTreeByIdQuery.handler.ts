import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { GetMerkleTreeByIdQuery } from './getMerkleTreeById.query';
import { BpiMerkleTree } from '../../models/bpiMerkleTree';
import { MerkleTreeAgent } from '../../agents/merkleTree.agent';

@QueryHandler(GetMerkleTreeByIdQuery)
export class GetMerkleTreeByIdQueryHandler
  implements IQueryHandler<GetMerkleTreeByIdQuery>
{
  constructor(
    @InjectMapper() private autoMapper: Mapper,
    private readonly agent: MerkleTreeAgent,
  ) {}

  async execute(query: GetMerkleTreeByIdQuery) {
    const merkleTree =
      await this.agent.fetchMerkleTreeByIdAndThrowIfValidationFails(query.id);

    return this.autoMapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }
}
