import { Witness } from '../../models/witness';

export interface ICircuitService {
  createWitness(
    inputs: object,
    circuitName: string,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToVerificationKey: string,
  ): Promise<Witness>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
