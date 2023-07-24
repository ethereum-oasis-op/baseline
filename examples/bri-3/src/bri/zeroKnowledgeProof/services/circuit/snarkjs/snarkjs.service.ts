import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuit.interface';
import * as snarkjs from 'snarkjs';
// TODO: Does not compile atm because the circuit_verification_key.json does not exist
// Probably has to be dynamically loaded
// import * as verificationKey from '../../../../../../zeroKnowledgeKeys/circuit/circuit_verification_key.json';
import 'dotenv/config';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(inputs: object): Promise<Witness> {
    this.witness = new Witness();

    const { proof, publicInputs } = await this.executeCircuit(inputs);

    this.witness.proof = proof;

    this.witness.publicInputs = publicInputs;

    // TODO: Above TODO
    // this.witness.verificationKey = verificationKey;
    return this.witness;
  }

  createProof(witness: Witness): Promise<Proof> {
    throw new Error('Method not implemented.');
  }
  verifyProof(proof: Proof, witness: Witness): Promise<boolean> {
    throw new Error('Method not implemented.');
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

  private async executeCircuit(
    inputs: object,
  ): Promise<{ proof: Proof; publicInputs: string[] }> {
    const { proof, publicSignals: publicInputs } =
      await snarkjs.groth16.fullProve(
        inputs,
        process.env.SNARKJS_CIRCUIT_WASM,
        process.env.SNARKJS_PROVING_KEY,
      );

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
      protocol: proof.protocol,
      curve: proof.curve,
    } as Proof;

    return { proof: newProof, publicInputs };
  }
}
