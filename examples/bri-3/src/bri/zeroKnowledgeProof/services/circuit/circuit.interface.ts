import { Proof } from '../../models/proof';
import { Witness } from '../../models/witness';

export interface ICircuitService {
  witness: Witness;
  createWitness(input: object): Promise<Witness>;
  createProof(witness: Witness): Promise<Proof>;
  verifyProof(proof: Proof, witness: Witness): Promise<boolean>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
