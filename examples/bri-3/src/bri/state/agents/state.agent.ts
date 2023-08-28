import {
  Injectable,
} from '@nestjs/common';

import MerkleTree from 'merkletreejs';
import { MerkleTreeStorageAgent } from '../../merkleTree/agents/merkleTreeStorage.agent';
import { Witness } from '../../zeroKnowledgeProof/models/witness';
import { BpiAccountStorageAgent } from '../../identity/bpiAccounts/agents/bpiAccountsStorage.agent';

// TODO: We should follow this approach everywhere for storage
// https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#scenario-pre-computed-ids-and-the-transaction-api
// We precompute Ids, collect all storage actions from the relevant storage agents
// and then execute a single prisma transaction at the end of the command handler
// Best way to achieve this is to have a provider called i.e dbContext, which is scoped as REQUEST
// that is injected in every agent and serves as the place where we collect all the db actions created by storage agents which are invoked by
// by regular agents. This dbContext is in the end passed to prisma.transaction call.
@Injectable()
export class StateAgent {
  constructor(
    private bpiAccountStorageAgent: BpiAccountStorageAgent,
    private merkleTreetStorageAgent: MerkleTreeStorageAgent
  ) {}

  public async storeNewLeafInStateTree(bpiAccountId: string, stateLeaf: Buffer, merkelizedPayload: MerkleTree, witness: Witness): Promise<void> {
    // unmarsahling from text to merkleTree.js object should happen inside
    const bpiAccount = await this.bpiAccountStorageAgent.getAccountById(bpiAccountId);

    // hasStateTree method on domain object
    if (!bpiAccount.stateTree) {
      // construct the new empty merkle tree js object
    }

    // addleafToStateTree method on domain object
    bpiAccount.stateTree.tree.addLeaf(stateLeaf)
    
    await this.merkleTreetStorageAgent.storeUpdatedMerkleTree(bpiAccount.stateTree);

    const newLeafIndex = bpiAccount.stateTree.tree.getLeafIndex(stateLeaf);

    this.bpiAccountStorageAgent.storeBpiAccountStateTreeLeafValue(
        bpiAccount.id, 
        newLeafIndex,
        merkelizedPayload, 
        witness);
  }
}
