import { Injectable } from '@nestjs/common';
import { SnarkjsCircuitService } from './snarkjs/snarkjs';
import { Witness } from '../../models/witness';

@Injectable()
export class CircuitService {
  constructor(private readonly circuit: SnarkjsCircuitService) {}
  async createProof(inputs: object) {
    return await this.circuit.createProof(inputs);
  }

  async verifyProof(witness: Witness): Promise<boolean> {
    return await this.circuit.verifyProof(witness);
  }
}
