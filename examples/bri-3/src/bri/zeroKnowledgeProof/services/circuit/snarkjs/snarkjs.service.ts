import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuitService.interface';
import { computeEcdsaSigPublicInputs } from './utils/computePublicInputs';
import * as snarkjs from 'snarkjs';
import { Transaction } from '../../../../transactions/models/transaction';

@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(
    inputs: {
      tx: Transaction;
    },
    circuitName: string,
    pathToCircuit: string,
    pathToProvingKey: string,
    pathToVerificationKey: string,
  ): Promise<Witness> {
    this.witness = new Witness();

    const preparedInputs = await this.prepareInputs(inputs, circuitName);

    const { proof, publicInputs } = await this.executeCircuit(
      preparedInputs,
      pathToCircuit,
      pathToProvingKey,
    );

    this.witness.proof = proof;

    this.witness.publicInputs = publicInputs;

    this.witness.verificationKey = await import(pathToVerificationKey);

    return this.witness;
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
    pathToCircuit: string,
    pathToProvingKey: string,
  ): Promise<{ proof: Proof; publicInputs: string[] }> {
    const { proof, publicSignals: publicInputs } =
      await snarkjs.groth16.fullProve(inputs, pathToCircuit, pathToProvingKey);

    const newProof = {
      a: proof.pi_a,
      b: proof.pi_b,
      c: proof.pi_c,
      protocol: proof.protocol,
      curve: proof.curve,
    } as Proof;

    return { proof: newProof, publicInputs };
  }

  private async prepareInputs(
    inputs: {
      tx: Transaction;
    },
    circuitName: string,
  ): Promise<object> {
    return await this[circuitName](inputs);
  }

  // TODO: Mil5 - How to parametrize this for different use-cases?
  private async workstep1(inputs: { tx: Transaction }): Promise<object> {
    //1. Ecdsa signature
    const { signature, Tx, Ty, Ux, Uy, publicKeyX, publicKeyY } =
      computeEcdsaSigPublicInputs(inputs.tx);

    //2. Items
    const payload = JSON.parse(inputs.tx.payload);

    const itemPrices: number[] = [];
    const itemAmount: number[] = [];

    payload.items.forEach((item: object) => {
      itemPrices.push(item['price']);
      itemAmount.push(item['amount']);
    });

    const preparedInputs = {
      invoiceStatus: this.calculateStringCharCodeSum(payload.status),
      invoiceAmount: payload.amount,
      itemPrices,
      itemAmount,
      signature,
      publicKeyX,
      publicKeyY,
      Tx,
      Ty,
      Ux,
      Uy,
    };

    return preparedInputs;
  }

  private calculateStringCharCodeSum(status: string): number {
    let sum = 0;

    for (let i = 0; i < status.length; i++) {
      sum += status.charCodeAt(i);
    }

    return sum;
  }
}
