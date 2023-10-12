import { Signature } from 'ethers';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import { ec as EC } from 'elliptic';
import { ethers } from 'ethers';
import { Transaction } from '../../../../../transactions/models/transaction';
import MerkleTree from 'merkletreejs';
import { MerkleTree as FixedMerkleTree } from 'fixed-merkle-tree';
import * as crypto from 'crypto';
import * as circomlib from 'circomlibjs';
import * as ed2curve from 'ed2curve';

export const computeEffectiveEcdsaSigPublicInputs = (
  signature: Signature,
  msgHash: Buffer,
  publicKeyHex: string,
) => {
  const ec = new EC('secp256k1');

  //Public Key
  const publicKeyBuffer = ethers.utils.arrayify(publicKeyHex);
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
    publicKeyX: publicKeyCoordinates.getX().toString(),
    publicKeyY: publicKeyCoordinates.getY().toString(),
  };

  return input;
};

export const computeEcdsaSigPublicInputs = (tx: Transaction) => {
  const ecdsaSignature = ethers.utils.splitSignature(tx.signature);

  const messageHash = Buffer.from(
    ethers.utils.arrayify(ethers.utils.hashMessage(tx.payload)),
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
    crypto
      .createHash(`${process.env.MERKLE_TREE_HASH_ALGH}`)
      .update(`${left}${right}`)
      .digest('hex');
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

export const computeEddsaSigPublicInputs = async (tx: Transaction) => {
  const babyJub = await circomlib.buildBabyjub();

  const hashedPayload = crypto
    .createHash(`${process.env.MERKLE_TREE_HASH_ALGH}`)
    .update(tx.payload)
    .digest()
    .toString();

  const message = Buffer.from(hashedPayload, 'hex');

  const publicKey = tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey;
  // Parse the hex-encoded key into Uint8Array
  const publicKeyBytes = Uint8Array.from(Buffer.from(publicKey, 'hex'));

  //ed25519 key to curve25519 key
  const eddsaCurvePointBytes = ed2curve.convertPublicKey(
    publicKeyBytes,
  ) as Uint8Array;

  //Extract X and Y coordinates from curve25519 public key
  const curvePoint = babyJub.unpackPoint(eddsaCurvePointBytes);
  const pPubKey = babyJub.packPoint(curvePoint);

  const signature = Uint8Array.from(Buffer.from(tx.signature, 'hex'));

  const messageBits = buffer2bits(message);
  const r8Bits = buffer2bits(Buffer.from(signature.slice(0, 32)));
  const sBits = buffer2bits(Buffer.from(signature.slice(32, 64)));
  const aBits = buffer2bits(Buffer.from(pPubKey));

  const inputs = {
    message: messageBits,
    A: aBits,
    R8: r8Bits,
    S: sBits,
  };

  return inputs;
};

const buffer2bits = (buffer: Buffer) => {
  const res: bigint[] = [];
  for (let i = 0; i < buffer.length; i++) {
    for (let j = 0; j < 8; j++) {
      if ((buffer[i] >> j) & 1) {
        res.push(BigInt('1n'));
      } else {
        res.push(BigInt('0n'));
      }
    }
  }
  return res;
};
