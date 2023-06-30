import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(inputs: object): Promise<Witness> {
    this.witness = new Witness();

    const proof = await this.createProof(inputs);
    this.witness.proof = proof;

    this.witness.verificationKey = process.env.SNARKJS_VERIFICATION_KEY;

    return this.witness;
  }

  public async createProof(inputs: any): Promise<Proof> {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      process.env.SNARKJS_PROVING_KEY,
      process.env.SNARKJS_CIRCUIT_WASM,
    );

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
    } as Proof;

    this.witness.publicInput = publicSignals;

    return newProof;
  }

  public async verifyProofUsingWitness(witness: Witness): Promise<boolean> {
    const isVerified = await snarkjs.groth16.verify(
      witness.verificationKey,
      witness.publicInput,
      witness.proof,
    );
    return isVerified;
  }
}
