import { Injectable, NotFoundException } from '@nestjs/common';

import MerkleTree from 'merkletreejs';
import { BpiAccountStorageAgent } from '../bpiAccounts/agents/bpiAccountsStorage.agent';
import { BpiAccount } from '../bpiAccounts/models/bpiAccount';
import { MerkleTreeAgent } from '../../merkleTree/agents/merkleTree.agent';
import { MerkleTreeStorageAgent } from '../../merkleTree/agents/merkleTreeStorage.agent';
import { Witness } from '../../zeroKnowledgeProof/models/witness';
import { StateTreeLeafValueContent } from '../models/stateTreeLeafValueContent';
import { LEAF_STATE_VALUE_NOT_FOUND_ERR_MESSAGE } from '../bpiAccounts/api/err.messages';

// TODO: #742 MIL5 - Introduce unit tests once https://github.com/demonsters/prisma-mock implemented
@Injectable()
export class StateAgent {
  constructor(
    private bpiAccountStorageAgent: BpiAccountStorageAgent,
    private merkleTreetStorageAgent: MerkleTreeStorageAgent,
    private merkleTreeAgent: MerkleTreeAgent,
  ) {}

  public async storeNewLeafInStateTree(
    bpiAccount: BpiAccount,
    stateLeaf: string,
    merkelizedPayload: MerkleTree,
    witness: Witness,
  ): Promise<string> {
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

    return stateTree.getRoot();
  }

  public async storeNewLeafInHistoryTree(
    bpiAccount: BpiAccount,
    stateTreeRoot: string,
  ): Promise<void> {
    let historyTree = await this.merkleTreetStorageAgent.getMerkleTreeById(
      bpiAccount.historyTreeId,
    );

    if (!historyTree) {
      historyTree = this.merkleTreeAgent.createNewMerkleTree([]);
    }

    historyTree.addLeaf(stateTreeRoot);

    await this.merkleTreetStorageAgent.storeUpdatedMerkleTree(historyTree);
  }

  public async getStateLeafValues(
    stateLeaf: string,
  ): Promise<StateTreeLeafValueContent> {
    const stateLeafValues =
      await this.bpiAccountStorageAgent.getAccompanyingStateLeafValues(
        stateLeaf,
      );

    if (!stateLeafValues) {
      throw new NotFoundException(LEAF_STATE_VALUE_NOT_FOUND_ERR_MESSAGE);
    }

    return stateLeafValues;
  }
}
