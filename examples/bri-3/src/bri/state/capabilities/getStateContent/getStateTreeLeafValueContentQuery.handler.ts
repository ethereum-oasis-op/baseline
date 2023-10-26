import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiAccountAgent } from '../../../identity/bpiAccounts/agents/bpiAccounts.agent';
import { MerkleTreeAgent } from '../../../merkleTree/agents/merkleTree.agent';
import { StateAgent } from '../../agents/state.agent';
import { StateTreeLeafValueContentDto } from '../../api/dtos/response/stateTreeLeafValueContent.dto';
import { StateTreeLeafValueContent } from '../../models/stateTreeLeafValueContent';
import { GetStateTreeLeafValueContentQuery } from './getStateTreeLeafValueContent.query';

@QueryHandler(GetStateTreeLeafValueContentQuery)
export class GetStateTreeLeafValueContentQueryHandler
  implements IQueryHandler<GetStateTreeLeafValueContentQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly agent: StateAgent,
    private readonly bpiAccountAgent: BpiAccountAgent,
    private readonly merkleTreeAgent: MerkleTreeAgent,
  ) {}

  async execute(query: GetStateTreeLeafValueContentQuery) {
    const stateLeafValues = await this.agent.getStateLeafValues(
      query.leafValue,
    );

    const bpiAccount =
      await this.bpiAccountAgent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        stateLeafValues.bpiAccountId,
      );

    const bpiMerkleTree =
      await this.merkleTreeAgent.fetchMerkleTreeByIdAndThrowIfValidationFails(
        bpiAccount.stateTreeId,
      );

    stateLeafValues.merkleTree = bpiMerkleTree.tree;

    return this.mapper.map(
      stateLeafValues,
      StateTreeLeafValueContent,
      StateTreeLeafValueContentDto,
    );
  }
}
