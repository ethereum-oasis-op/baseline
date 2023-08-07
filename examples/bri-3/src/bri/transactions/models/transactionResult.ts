import MerkleTree from 'merkletreejs';
import { Witness } from '../../zeroKnowledgeProof/models/witness';

export class TransactionResult {
  merkelizedPayload: MerkleTree;
  witness: Witness;
}
