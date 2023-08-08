import { ECDSASignature } from '@ethereumjs/util';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import * as elliptic from 'elliptic';
const ec = elliptic.ec;

export const computeEcdsaPublicInputs = (
  signature: ECDSASignature,
  msgHash: Buffer,
  publicKey: Buffer,
) => {
  const publicKeyCoordinates = ec.prototype
    .keyFromPublic(publicKey.toString('hex'))
    .getPublic();

  const r = BigInt('0x' + signature.r.toString('hex'));
  const circuitPubInput = computeEffEcdsaPubInput(r, signature.v, msgHash);
  const input = {
    signature: BigInt('0x' + signature.s.toString('hex')),
    Tx: circuitPubInput.Tx,
    Ty: circuitPubInput.Ty,
    Ux: circuitPubInput.Ux,
    Uy: circuitPubInput.Uy,
    publicKeyX: publicKeyCoordinates.getX().toString(),
    publicKeyY: publicKeyCoordinates.getY().toString(),
  };

  return input;
};
