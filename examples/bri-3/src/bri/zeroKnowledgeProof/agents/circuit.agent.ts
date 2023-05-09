import { Injectable } from '@nestjs/common';
import { CircuitService } from '../services/circuit/circuit.service';

@Injectable()
export class CircuitAgent {
  constructor(private readonly circuitAgent: CircuitService) {}

  public async createProof(inputs: object): Promise<any> {
    const { proof, publicInput } = await this.circuitAgent.createProof(inputs);
    return { proof, publicInput };
  }

  public async verifyProof(proof, publicInput): Promise<boolean> {
    return await this.circuitAgent.verifyProof(proof, publicInput);
  }
}
