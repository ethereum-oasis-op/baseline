import { Witness } from '../../models/witness';

export interface ICircuitService {
  witness: Witness;
  createWitness(input: object): Promise<Witness>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
