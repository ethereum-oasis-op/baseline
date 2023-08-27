import { Injectable } from '@nestjs/common';
import { Witness } from '../../../models/witness';
import { Proof } from '../../../models/proof';
import { ICircuitService } from '../circuitService.interface';
import { computeEcdsaPublicInputs } from './utils/ecdsa/computeEcdsaPublicInputs';
import * as snarkjs from 'snarkjs';
import MerkleTree from 'merkletreejs';
import { MerkleTree as FixedMerkleTree } from 'fixed-merkle-tree';
import { Transaction } from '../../../../transactions/models/transaction';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
@Injectable()
export class SnarkjsCircuitService implements ICircuitService {
  public witness: Witness;

  public async createWitness(
    inputs: {
      tx: Transaction;
      merklelizedPayload: MerkleTree;
      stateTree: MerkleTree;
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
      merklelizedPayload: MerkleTree;
      stateTree: MerkleTree;
    },
    circuitName: string,
  ): Promise<object> {
    return await this[circuitName](inputs);
  }

  // TODO: Mil5 - How to parametrize this for different use-cases?
  private async workstep1(inputs: {
    tx: Transaction;
    merklelizedPayload: MerkleTree;
    stateTree: MerkleTree;
  }): Promise<object> {
    //Ecdsa signature
    const ecdsaSignature = ethers.utils.splitSignature(inputs.tx.signature);

    const messageHash = ethers.utils.arrayify(
      ethers.utils.hashMessage(inputs.tx.payload),
    );

    const publicKey = inputs.tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey;

    const { signature, Tx, Ty, Ux, Uy, publicKeyX, publicKeyY } =
      computeEcdsaPublicInputs(
        ecdsaSignature,
        Buffer.from(messageHash),
        publicKey,
      );

    //Items
    const payload = JSON.parse(inputs.tx.payload);

    const itemPrices: number[] = [];
    const itemAmount: number[] = [];

    payload.items.forEach((item: object) => {
      itemPrices.push(item['price']);
      itemAmount.push(item['amount']);
    });

    // const merkelizedInvoiceRoot = BigInt(
    //   '0x' + inputs.merklelizedPayload.getHexRoot(),
    // );

    // const stateTreeRoot = BigInt('0x' + inputs.stateTree.getHexRoot());

    //convert
    const sha256Hash = (left: any, right: any) =>
      crypto.createHash('sha256').update(`${left}${right}`).digest('hex');
    const ZERO_ELEMENT =
      '21663839004416932945382355908790599225266501822907911457504978515578255421292';

    const merkelizedInvoiceHashedLeaves =
      inputs.merklelizedPayload.getHexLeaves();
    const fixedMerkelizedInvoice = new FixedMerkleTree(
      5,
      merkelizedInvoiceHashedLeaves,
      {
        hashFunction: sha256Hash,
        zeroElement: ZERO_ELEMENT,
      },
    );

    fixedMerkelizedInvoice.root;

    const stateTreeHexLeaves = inputs.stateTree.getHexLeaves();
    const fixedStateTree = new FixedMerkleTree(10, stateTreeHexLeaves, {
      hashFunction: sha256Hash,
      zeroElement: ZERO_ELEMENT,
    });

    const { pathElements, pathIndices } = fixedStateTree.path(0);

    const preparedInputs = {
      invoiceStatus: payload.status,
      invoiceAmount: payload.amount,
      itemPrices,
      itemAmount,
      merkelizedInvoiceRoot: fixedMerkelizedInvoice.root,
      stateTreeRoot: fixedStateTree.root,
      stateTree: pathElements,
      stateTreeLeafPosition: pathIndices,
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
}
