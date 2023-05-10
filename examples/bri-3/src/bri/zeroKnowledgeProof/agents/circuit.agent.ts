import { Injectable } from '@nestjs/common';
import { ICircuitService } from '../services/circuit/circuit.interface';
import { Witness } from '../models/witness';

@Injectable()
export class CircuitAgent {
  constructor(private readonly circuitService: ICircuitService) {}

  public async createProof(input: any): Promise<Witness> {
    const witness = await this.circuitService.createProof(input);
    return witness;
  }

  public async verifyProof(witness: Witness): Promise<boolean> {
    const isVerified = await this.circuitService.verifyProof(witness);
    return isVerified;
  }
}
