import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public async createWitness(input: object): Promise<Witness> {
    const witness: Witness = {
      proof: { a: ['a'], b: [['b']], c: ['c'] },
      publicInput: ['publicInput'],
      verificationKey: 'verificationKey',
    };

    return witness;
  }

  public async createProof(witness: Witness): Promise<Proof> {
    return witness.proof;
  }

  public async verifyProof(proof: Proof, witness: Witness): Promise<boolean> {
    return true;
  }

  private async getProvingKey(): Promise<string> {
    return 'provingKey';
  }

  private async getVerificationKey(): Promise<string> {
    return 'verificationKey';
  }
}
