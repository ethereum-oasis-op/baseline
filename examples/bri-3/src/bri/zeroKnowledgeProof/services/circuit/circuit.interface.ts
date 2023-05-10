import { Witness } from '../../models/witness';

export interface ICircuitService {
  createProof(input: object): Promise<Witness>;
  verifyProof(witness: Witness): Promise<boolean>;
}
