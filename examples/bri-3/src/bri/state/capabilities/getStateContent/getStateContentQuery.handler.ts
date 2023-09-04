import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStateContentQuery } from './getStateContent.query';
import { MerkleTreeAgent } from '../../../merkleTree/agents/merkleTree.agent';
import { StateAgent } from '../../agents/state.agent';
import { BpiAccountAgent } from '../../../identity/bpiAccounts/agents/bpiAccounts.agent';
import { StateContent } from '../../models/stateContent';

@QueryHandler(GetStateContentQuery)
export class GetStateContentQueryHandler
  implements IQueryHandler<GetStateContentQuery>
{
  constructor(
    private readonly agent: StateAgent,
    private readonly bpiAccountAgent: BpiAccountAgent,
    private readonly merkleTreeAgent: MerkleTreeAgent,
  ) {}

  async execute(query: GetStateContentQuery) {
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

    return new StateContent(stateLeafValues, bpiMerkleTree.tree);
  }
}
