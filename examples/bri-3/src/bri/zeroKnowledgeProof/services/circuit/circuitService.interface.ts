import { Witness } from '../../models/witness';

export interface ICircuitService {
  createWitness(
    inputs: object,
    circuitName: string,
    pathToCircuit: string,
    pathToCircuitWasm?: string,
    pathToProvingKey?: string,
    pathToVerificationKey?: string,
  ): Promise<Witness>;
  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
