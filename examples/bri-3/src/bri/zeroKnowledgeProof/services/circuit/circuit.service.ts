import { Injectable } from '@nestjs/common';

@Injectable()
export class CircuitService {
  async createProof() {
    return { proof: 'proof', publicInput: 'publicInput' };
  }

  async verifyProof(proof, publicInputs, verificationKey?): Promise<boolean> {
    return true;
  }
}
