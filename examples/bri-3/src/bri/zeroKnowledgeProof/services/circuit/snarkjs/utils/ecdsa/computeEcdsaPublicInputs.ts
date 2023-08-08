import { ECDSASignature } from '@ethereumjs/util';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import * as elliptic from 'elliptic';
const ec = elliptic.ec;

export const computeEcdsaPublicInputs = (
  signature: ECDSASignature,
  msgHash: Buffer,
  publicKeyHex: string,
) => {
  //Public Key
  const publicKeyBuffer = Buffer.from(publicKeyHex.split('Ox')[1], 'hex');
  const publicKeyCoordinates = ec.prototype
    .keyFromPublic(publicKeyBuffer.toString('hex'))
    .getPublic();

  //Signature
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
