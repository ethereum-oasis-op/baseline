import { AutoMap } from '@automapper/classes';
export class ZeroKnowledgeProofVerificationInput {
  @AutoMap()
  publicWitness: string;

  @AutoMap()
  proof: string;

  @AutoMap()
  verificationKey: string;

  constructor(publicWitness: string, proof: string, verificationKey: string) {
    this.publicWitness = publicWitness;
    this.proof = proof;
    this.verificationKey = verificationKey;
  }
}
