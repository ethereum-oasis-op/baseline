import { keccak256 } from 'ethers/lib/utils';
import * as circomlib from 'circomlibjs';
import * as crypto from 'crypto';
import { ethers } from 'ethers';

export async function createEddsaPrivateKey(
  ecdsaPublicKeyOwnerEthereumAccount: string,
  signer: ethers.Wallet,
): Promise<string> {
  const message = keccak256(ecdsaPublicKeyOwnerEthereumAccount);
  const eddsaPrivateKey = await signer.signMessage(message);

  return eddsaPrivateKey;
}

export async function createEddsaPublicKey(
  eddsaPrivateKey: string,
): Promise<string> {
  const eddsa = await circomlib.buildEddsa();
  const babyJub = await circomlib.buildBabyjub();

  const privateKeyBytes = Buffer.from(eddsaPrivateKey, 'hex');
  const publicKeyPoints = eddsa.prv2pub(privateKeyBytes);
  const eddsaPublicKey = Buffer.from(
    babyJub.packPoint(publicKeyPoints),
  ).toString('hex');

  return eddsaPublicKey;
}

export async function createEddsaSignature(
  payload: any,
  eddsaPrivateKey: string,
): Promise<string> {
  const eddsa = await circomlib.buildEddsa();
  const hashedPayload = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest();

  const eddsaSignature = eddsa.signPedersen(eddsaPrivateKey, hashedPayload);
  const packedSignature = eddsa.packSignature(eddsaSignature);
  const signature = Buffer.from(packedSignature).toString('hex');
  return signature;
}
