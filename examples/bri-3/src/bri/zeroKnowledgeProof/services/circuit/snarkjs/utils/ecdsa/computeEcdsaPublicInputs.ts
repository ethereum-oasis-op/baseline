import { Signature } from 'ethers';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';
import * as elliptic from 'elliptic';
const ec = elliptic.ec;

export const computeEcdsaPublicInputs = (
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
