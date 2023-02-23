import { AutoMap } from '@automapper/classes';
import { MerkleTree } from '../../zeroKnowledgeProof/services/merkleTree/merkleTree';
import { MerkleProofWitness } from './merkleProofWItness';

export class StateObject {
  @AutoMap()
  id: string;

  @AutoMap()
  curve: string;

  @AutoMap()
  hashFunction: string;

  @AutoMap()
  proverSystem: string;

  @AutoMap()
  witness: MerkleProofWitness;

  @AutoMap()
  stateTrie: MerkleTree;

  constructor(
    id: string,
    proof: string,
    document: string,
    proverSystem: string,
    witness: MerkleProofWitness,
  ) {
    this.id = id;
    this.curve = proof;
    this.hashFunction = document;
    this.proverSystem = proverSystem;
    this.witness = witness;
  }
}
