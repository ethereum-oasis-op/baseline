import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { ICircuitService } from '../circuit.interface';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public async createProof(input: object) {
    const witness = {
      proof: 'proof',
      publicInput: 'publicInput',
      verificationKey: 'verificationKey',
    };

    return witness;
  }

  public async verifyProof(witness: Witness): Promise<boolean> {
    return true;
  }

  private async getProvingKey(): Promise<string> {
    return 'provingKey';
  }

  private async getVerificationKey(): Promise<string> {
    return 'verificationKey';
  }
}
