import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { MerkleTreeStorageAgent } from '../../agents/merkleTreeStorage.agent';
import { MerkleTreeDto } from '../../api/dtos/response/merkleTree.dto';
import { GetMerkleTreeByIdQuery } from './getMerkleTreeById.query';
import { BpiMerkleTree } from '../../models/bpiMerkleTree';

@QueryHandler(GetMerkleTreeByIdQuery)
export class GetMerkleTreeByIdQueryHandler
  implements IQueryHandler<GetMerkleTreeByIdQuery>
{
  constructor(
    @InjectMapper() private autoMapper: Mapper,
    private readonly storageAgent: MerkleTreeStorageAgent,
  ) {}

  async execute(query: GetMerkleTreeByIdQuery) {
    const merkletree = await this.storageAgent.getMerkleTreeById(query.id);

    if (!merkletree) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.autoMapper.map(merkletree, BpiMerkleTree, MerkleTreeDto);
  }
}
