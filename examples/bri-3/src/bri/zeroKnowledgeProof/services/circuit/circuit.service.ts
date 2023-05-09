import { Injectable } from '@nestjs/common';
import { SnarkjsCircuitService } from './snarkjs/snarkjs';

@Injectable()
export class CircuitService {
  constructor(private readonly circuit: SnarkjsCircuitService) {}
  async createProof(inputs: object) {
    return { proof: 'proof', publicInput: 'publicInput' };
  }

  async verifyProof(proof, publicInputs): Promise<boolean> {
    return true;
  }
}
