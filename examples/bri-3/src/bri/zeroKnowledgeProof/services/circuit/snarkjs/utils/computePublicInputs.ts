import { Signature } from 'ethers';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import * as elliptic from 'elliptic';
const ec = elliptic.ec;
import { ethers } from 'ethers';
import { Transaction } from '../../../../../transactions/models/transaction';
import MerkleTree from 'merkletreejs';
import { MerkleTree as FixedMerkleTree } from 'fixed-merkle-tree';
import * as crypto from 'crypto';

export const computeEffectiveEcdsaPublicInputs = (
  signature: Signature,
  msgHash: Buffer,
  publicKeyHex: string,
) => {
  //Public Key
  const publicKeyBuffer = Buffer.from(publicKeyHex.split('Ox')[1], 'hex');
  const publicKeyCoordinates = ec.prototype
    .keyFromPublic(publicKeyBuffer.toString('hex'))
    .getPublic();

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
    publicKeyX: publicKeyCoordinates.getX().toString(),
    publicKeyY: publicKeyCoordinates.getY().toString(),
  };

  return input;
};

export const computeEcdsaPublicInputs = (tx: Transaction) => {
  const ecdsaSignature = ethers.utils.splitSignature(tx.signature);

  const messageHash = ethers.utils.arrayify(
    ethers.utils.hashMessage(tx.payload),
  );

  const publicKey = tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey;

  return computeEffectiveEcdsaPublicInputs(
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
  const fixedMerkelizedInvoice = new FixedMerkleTree(
    5,
    merkelizedInvoiceHashedLeaves,
    {
      hashFunction: sha256Hash,
      zeroElement: ZERO_ELEMENT,
    },
  );

  const stateTreeHexLeaves = stateTree.getHexLeaves();
  const fixedStateTree = new FixedMerkleTree(10, stateTreeHexLeaves, {
    hashFunction: sha256Hash,
    zeroElement: ZERO_ELEMENT,
  });

  const { pathElements, pathIndices } = fixedStateTree.path(0);

  return {
    merkelizedInvoiceRoot: fixedMerkelizedInvoice.root,
    stateTreeRoot: fixedStateTree.root,
    stateTree: pathElements,
    stateTreeLeafPosition: pathIndices,
  };
};
