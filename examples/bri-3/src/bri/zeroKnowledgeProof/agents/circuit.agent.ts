import { Injectable } from '@nestjs/common';
import { ICircuitService } from '../services/circuit/circuit.interface';
import { Witness } from '../models/witness';
import { Proof } from '../models/proof';

@Injectable()
export class CircuitAgent {
  constructor(private readonly circuitService: ICircuitService) {}

  public async createWitness(input: object): Promise<Witness> {
    return await this.circuitService.createWitness(input);
  }

  public async createProof(witness: Witness): Promise<Proof> {
    return await this.circuitService.createProof(witness);
  }

  public async verifyProof(proof: Proof, witness: Witness): Promise<boolean> {
    return await this.circuitService.verifyProof(proof, witness);
  }
}
