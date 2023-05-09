import { Injectable } from '@nestjs/common';
import { SnarkjsCircuitService } from './snarkjs/snarkjs';

@Injectable()
export class CircuitService {
  constructor(private readonly circuit: SnarkjsCircuitService) {}
  async createProof(inputs: object) {
    return await this.circuit.createProof(inputs);
  }

  async verifyProof(proof, publicInputs): Promise<boolean> {
    return await this.circuit.verifyProof(proof, publicInputs);
  }
}
