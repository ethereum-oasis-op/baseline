import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';
import * as fs from 'fs';
import * as p from ;

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public async createWitness(input: object): Promise<Witness> {
    const witness: Witness = {
      proof: { a: ['a'], b: [['b']], c: ['c'] },
      publicInput: ['publicInput'],
      verificationKey: 'verificationKey',
    };

    return witness;
  }

  public async createProof(witness: Witness): Promise<Proof> {
    return witness.proof;
  }

  public async verifyProof(proof: Proof, witness: Witness): Promise<boolean> {
    return true;
  }

  private async getProvingKeyPath(): Promise<string> {
    return '../../../../../../zeroKnowledgeKeys/circuit/circuit_final.zkey';
  }

  private async getWasmFilePath(): Promise<string> {
    return '../../../../../../zeroKnowledgeKeys/circuit/circuit_js/circuit.wasm'; 
  }

  private async getVerificationKey(): Promise<string> {
    return 'verificationKey';
  }

  private getFile(path: string): Buffer {
    return fs.readFileSync(path);
  }
}
