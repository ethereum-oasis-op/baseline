import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';
import * as verificationKey from '../../../../../../zeroKnowledgeKeys/circuit/circuit_verification_key.json';
import 'dotenv/config';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(inputs: object): Promise<Witness> {
    this.witness = new Witness();

    const proof = await this.createProof(inputs);
    this.witness.proof = proof;

    const publicInputs = await this.getPublicInputs(inputs);
    this.witness.publicInputs = publicInputs;

    this.witness.verificationKey = verificationKey;
    return this.witness;
  }

  public async createProof(inputs: object): Promise<Proof> {
    const { proof } = await this.executeCircuit(inputs);

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
      protocol: proof.protocol,
      curve: proof.curve,
    } as Proof;

    return newProof;
  }

  public async verifyProofUsingWitness(witness: Witness): Promise<boolean> {
    const isVerified = await snarkjs.groth16.verify(
      witness.verificationKey,
      witness.publicInputs,
      {
        pi_a: witness.proof.a,
        pi_b: witness.proof.b,
        pi_c: witness.proof.c,
        protocol: witness.proof.protocol,
        curve: witness.proof.curve,
      },
    );
    return isVerified;
  }

  private async getPublicInputs(inputs): Promise<string[]> {
    const { publicInputs } = await this.executeCircuit(inputs);
    return publicInputs;
  }

  private async executeCircuit(
    inputs: object,
  ): Promise<{ proof: any; publicInputs: string[] }> {
    const { proof, publicSignals: publicInputs } =
      await snarkjs.groth16.fullProve(
        inputs,
        process.env.SNARKJS_CIRCUIT_WASM,
        process.env.SNARKJS_PROVING_KEY,
      );

    return { proof, publicInputs };
  }
}
