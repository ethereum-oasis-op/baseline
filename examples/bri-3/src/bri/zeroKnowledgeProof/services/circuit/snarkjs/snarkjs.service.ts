import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';

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

  public async createProof(publicInputs: any): Promise<Proof> {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      publicInputs,
      process.env.SNARKJS_PROVING_KEY,
      process.env.SNARKJS_CIRCUIT_WASM,
    );

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
      publicInputs: publicSignals,
    } as Proof;

    return newProof;
  }

  public async verifyProof(proof: Proof, witness: Witness): Promise<boolean> {
    return true;
  }
}
