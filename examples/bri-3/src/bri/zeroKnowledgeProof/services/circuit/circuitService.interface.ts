import { Witness } from '../../models/witness';
import { Transaction } from '../../../transactions/models/transaction';

export interface ICircuitService {
  createWitness(
    circuitInputs: object,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToVerificationKey: string,
    pathToWitnessCalculator?: string,
    pathToWitnessFile?: string,
  ): Promise<Witness>;

  verifyProofUsingWitness(witness: Witness): Promise<boolean>;
}
