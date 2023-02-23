import { AutoMap } from '@automapper/classes';
import { Leaf } from './leaf';

export class MerkleProofWitness {
  @AutoMap()
  id: string;

  @AutoMap()
  rootHash: string;

  @AutoMap()
  merkleProof: string[];

  @AutoMap()
  leaf: Leaf;

  constructor(id: string, rootHash: string, merkleProof: string[], leaf: Leaf) {
    this.id = id;
    this.rootHash = rootHash;
    this.merkleProof = merkleProof;
    this.leaf = leaf;
  }
}
