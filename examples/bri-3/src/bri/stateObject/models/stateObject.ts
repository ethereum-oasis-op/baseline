import { AutoMap } from '@automapper/classes';
import { MerkleTree } from '../../zeroKnowledgeProof/services/merkleTree/merkleTree';

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
  Witness: MerkleProofWitness;

  @AutoMap()
  stateTrie: MerkleTree;

  constructor(
    id: string,
    proof: string,
    document: string,
    proverSystem: string,
    storage: string,
  ) {
    this.id = id;
    this.curve = proof;
    this.hashFunction = document;
    this.proverSystem = proverSystem;
    this.Witness = storage;
  }
}
