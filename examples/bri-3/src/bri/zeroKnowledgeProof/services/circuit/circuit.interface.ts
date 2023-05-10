import { Proof } from '../../models/proof';
import { Witness } from '../../models/witness';

export interface ICircuitService {
  createWitness(input: object): Promise<Witness>;
  createProof(witness: Witness): Promise<Proof>;
  verifyProof(proof: Proof, witness: Witness): Promise<boolean>;
}
