import * as circomTester from 'circom_tester';
import { ec as EC } from 'elliptic';
import * as path from 'path';
import { hashPersonalMessage, ecsign } from '@ethereumjs/util';
import { computeEffEcdsaPubInput } from '@personaelabs/spartan-ecdsa';

const wasm_tester = circomTester.wasm;
const ec = new EC('secp256k1');

describe('Ecdsa', () => {
  it('should verify valid signature', async () => {
    const circuit = await wasm_tester(
      path.join(__dirname, './eff_ecdsa_test.circom'),
      {
        prime: 'secq256k1',
      },
    );

    const privKey = Buffer.from(
      'f5b552f608f5b552f608f5b552f6082ff5b552f608f5b552f608f5b552f6082f',
      'hex',
    );
    const pubKey = ec.keyFromPrivate(privKey.toString('hex')).getPublic();
    const msg = Buffer.from('hello world');
    const circuitInput = getEffEcdsaCircuitInput(privKey, msg);

    const w = await circuit.calculateWitness(circuitInput, true);

    await circuit.assertOut(w, {
      pubKeyX: pubKey.getX().toString(),
      pubKeyY: pubKey.getY().toString(),
    });

    await circuit.checkConstraints(w);
  });
});

const getEffEcdsaCircuitInput = (privKey: Buffer, msg: Buffer) => {
  const msgHash = hashPersonalMessage(msg);
  const { v, r: _r, s } = ecsign(msgHash, privKey);
  const r = BigInt('0x' + _r.toString('hex'));

  const circuitPubInput = computeEffEcdsaPubInput(r, v, msgHash);
  const input = {
    s: BigInt('0x' + s.toString('hex')),
    Tx: circuitPubInput.Tx,
    Ty: circuitPubInput.Ty,
    Ux: circuitPubInput.Ux,
    Uy: circuitPubInput.Uy,
  };

  return input;
};
