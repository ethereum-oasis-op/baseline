import { Injectable } from '@nestjs/common';
import { CircuitService } from '../services/circuit/circuit.service';

@Injectable()
export class CircuitAgent {
  constructor(private readonly circuitAgent: CircuitService) {}

  public async createProof(): Promise<any> {
    const { proof, publicInput } = await this.circuitAgent.createProof();
    return { proof, publicInput };
  }

  public async verifyProof(proof, publicInput): Promise<boolean> {
    return await this.circuitAgent.verifyProof(proof, publicInput);
  }
}
