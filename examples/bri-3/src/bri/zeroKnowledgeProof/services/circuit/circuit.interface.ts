import { Proof } from '../../models/proof';
import { Witness } from '../../models/witness';

export interface ICircuitService {
  witness: Witness;
  createWitness(input: object): Promise<Witness>;
  createProof(input: object): Promise<Proof>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
