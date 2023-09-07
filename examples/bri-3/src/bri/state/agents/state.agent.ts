
import { Injectable, NotFoundException } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { BpiAccountStorageAgent } from '../../identity/bpiAccounts/agents/bpiAccountsStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { MerkleTreeAgent } from '../../merkleTree/agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from '../../merkleTree/agents/merkleTreeStorage.agent';
import { Witness } from '../../zeroKnowledgeProof/models/witness';
import { StateLeafValues } from '../models/stateLeafValues';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { LEAF_STATE_VALUE_NOT_FOUND_ERR_MESSAGE } from '../../identity/bpiAccounts/api/err.messages';
import { StateContent } from '../models/stateContent';
import { BpiMerkleTree } from '@prisma/client';


// TODO: We should follow this approach everywhere for storage
// https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#scenario-pre-computed-ids-and-the-transaction-api
// We precompute Ids, collect all storage actions from the relevant storage agents
// and then execute a single prisma transaction at the end of the command handler
// Best way to achieve this is to have a provider called i.e dbContext, which is scoped as REQUEST
// that is injected in every agent and serves as the place where we collect all the db actions created by storage agents which are invoked by
// by regular agents. This dbContext is in the end passed to prisma.transaction call, so that db actions are executed in order
// as part of a single transaction.

// TODO: MIL5 - Introduce unit tests once https://github.com/demonsters/prisma-mock implemented
@Injectable()
export class StateAgent {
  constructor(
    @InjectMapper() private mapper: Mapper,
    private bpiAccountStorageAgent: BpiAccountStorageAgent,
    private merkleTreetStorageAgent: MerkleTreeStorageAgent,
    private merkleTreeAgent: MerkleTreeAgent,
  ) {}

  public async storeNewLeafInStateTree(
    bpiAccount: BpiAccount,
    stateLeaf: string,
    merkelizedPayload: MerkleTree,
    witness: Witness,
  ): Promise<void> {
    let stateTree = await this.merkleTreetStorageAgent.getMerkleTreeById(
      bpiAccount.stateTreeId,
    );

    if (!stateTree) {
      stateTree = this.merkleTreeAgent.createNewMerkleTree([]);
    }

    stateTree.addLeaf(stateLeaf);

    await this.merkleTreetStorageAgent.storeUpdatedMerkleTree(stateTree);

    this.bpiAccountStorageAgent.storeAccompanyingStateLeafValues(
      bpiAccount.id,
      stateLeaf,
      stateTree.getLeafIndex(stateLeaf),
      merkelizedPayload,
      witness,
    );
  }

  public async getStateLeafValues(stateLeaf: string): Promise<StateLeafValues> {
    const stateLeafValues =
      await this.bpiAccountStorageAgent.getAccompanyingStateLeafValues(
        stateLeaf,
      );

    if (!stateLeafValues) {
      throw new NotFoundException(LEAF_STATE_VALUE_NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(stateLeafValues, StateLeafValues, StateLeafValues);
  }
}
