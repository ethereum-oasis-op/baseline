import { Witness } from '../../models/witness';

export interface ICircuitService {
  witness: Witness;
  createWitness(input: object, circuitName: string): Promise<Witness>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
