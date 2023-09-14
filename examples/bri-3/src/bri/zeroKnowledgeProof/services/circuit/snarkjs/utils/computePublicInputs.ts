import { Signature } from 'ethers';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import { ec as EC } from 'elliptic';
import { ethers } from 'ethers';
import { Transaction } from '../../../../../transactions/models/transaction';
import MerkleTree from 'merkletreejs';
import { MerkleTree as FixedMerkleTree } from 'fixed-merkle-tree';
import * as crypto from 'crypto';

export const computeEffectiveEcdsaSigPublicInputs = (
  signature: Signature,
  msgHash: Buffer,
  publicKeyHex: string,
) => {
  const ec = new EC('secp256k1');
  //Public Key
  const publicKeyBuffer = Buffer.from(publicKeyHex.split('0x')[1], 'hex');

  const publicKeyCoordinates = ec.keyFromPublic(publicKeyBuffer).getPublic();

  //Signature
  const r = BigInt(signature.r);
  const circuitPubInput = computeEffEcdsaPubInput(
    r,
    BigInt(signature.v),
    msgHash,
  );
  const input = {
    signature: BigInt(signature.s),
    Tx: circuitPubInput.Tx,
    Ty: circuitPubInput.Ty,
    Ux: circuitPubInput.Ux,
    Uy: circuitPubInput.Uy,
    publicKeyX: BigInt(publicKeyCoordinates.getX().toString()),
    publicKeyY: BigInt(publicKeyCoordinates.getY().toString()),
  };

  return input;
};

export const computeEcdsaSigPublicInputs = (tx: Transaction) => {
  const ecdsaSignature = ethers.utils.splitSignature(tx.signature);

  const messageHash = ethers.utils.arrayify(
    ethers.utils.hashMessage(tx.payload),
  );

  const publicKey = tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey;

  return computeEffectiveEcdsaSigPublicInputs(
    ecdsaSignature,
    Buffer.from(messageHash),
    publicKey,
  );
};

export const computeMerkleProofPublicInputs = (
  merkelizedPayload: MerkleTree,
  stateTree: MerkleTree,
) => {
  const sha256Hash = (left: any, right: any) =>
    crypto.createHash('sha256').update(`${left}${right}`).digest('hex');
  const ZERO_ELEMENT =
    '21663839004416932945382355908790599225266501822907911457504978515578255421292';

  const merkelizedInvoiceHashedLeaves = merkelizedPayload.getHexLeaves();
  const merkelizedInvoicelevels = Math.ceil(
    Math.log2(merkelizedInvoiceHashedLeaves.length),
  );

  const fixedMerkelizedInvoice = new FixedMerkleTree(
    merkelizedInvoicelevels,
    merkelizedInvoiceHashedLeaves,
    {
      hashFunction: sha256Hash,
      zeroElement: ZERO_ELEMENT,
    },
  );

  const stateTreeHexLeaves = stateTree.getHexLeaves();
  const stateTreelevels = Math.ceil(Math.log2(stateTreeHexLeaves.length));
  const fixedStateTree = new FixedMerkleTree(
    stateTreelevels,
    stateTreeHexLeaves,
    {
      hashFunction: sha256Hash,
      zeroElement: ZERO_ELEMENT,
    },
  );

  const { pathElements, pathIndices } = fixedStateTree.path(0);

  return {
    merkelizedInvoiceRoot: fixedMerkelizedInvoice.root,
    stateTreeRoot: fixedStateTree.root,
    stateTree: pathElements,
    stateTreeLeafPosition: pathIndices,
  };
};
