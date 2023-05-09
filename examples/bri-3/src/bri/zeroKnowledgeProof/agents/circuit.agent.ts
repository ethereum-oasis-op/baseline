import { Injectable } from '@nestjs/common';
import { CircuitService } from '../services/circuit/circuit.service';
import { Witness } from '../models/witness';

@Injectable()
export class CircuitAgent {
  constructor(private readonly circuitAgent: CircuitService) {}

  public async createProof(input: any): Promise<Witness> {
    const witness = await this.circuitAgent.createProof(input);
    return witness;
  }

  public async verifyProof(witness: Witness): Promise<boolean> {
    const isVerified = await this.circuitAgent.verifyProof(witness);
    return isVerified;
  }
}
