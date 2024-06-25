import { SnarkjsCircuitService } from './snarkjs.service';
import { Transaction } from '../../../../transactions/models/transaction';
import { TransactionStatus } from '../../../../transactions/models/transactionStatus.enum';
import { BpiSubjectAccount } from '../../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../../../../identity/bpiSubjects/models/bpiSubject';
import {
  BpiSubjectRole,
  BpiSubjectRoleName,
} from '../../../../identity/bpiSubjects/models/bpiSubjectRole';
import { Witness } from '../../../models/witness';
import { ed25519 } from '@noble/curves/ed25519';
import * as circomlib from 'circomlibjs';
import * as crypto from 'crypto';
import 'dotenv/config';
import {
  PublicKey,
  PublicKeyType,
} from '../../../../identity/bpiSubjects/models/publicKey';

jest.setTimeout(20000);
//NOTE: Skiping out the workstep1 as it requires compiled artifacts to run.
describe.skip('SnarkjsService', () => {
  const snarkjs = new SnarkjsCircuitService();
  let tx: Transaction;
  let witness: Witness;

  beforeAll(async () => {
    const eddsa = await circomlib.buildEddsa();
    const babyJub = await circomlib.buildBabyjub();
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKeyPoints = eddsa.prv2pub(privateKey);
    const packedPublicKey = babyJub.packPoint(publicKeyPoints);
    const eddsaPublicKey = Buffer.from(packedPublicKey).toString('hex');

    const payload = JSON.stringify({
      bpiId: 'f9d8e7c2-3a1b-4f6d-a5f3-f0f8f9f8f8f8',
      supplierInvoiceID: 'INV-12345',
      buyerInvoiceID: 'INV-67890',
      amount: 2000.0,
      issueDate: '2020-05-01',
      dueDate: '2020-06-01',
      status: 'NEW',
      items: [
        {
          id: 1,
          productID: 'ABC123',
          price: 10.0,
          amount: 50,
        },
        {
          id: 2,
          productID: 'DEF456',
          price: 20.0,
          amount: 25,
        },
        {
          id: 3,
          productID: 'ABC123',
          price: 10.0,
          amount: 50,
        },
        {
          id: 4,
          productID: 'ABC123',
          price: 10.0,
          amount: 50,
        },
      ],
    });
    const role = new BpiSubjectRole(
      '12',
      BpiSubjectRoleName.INTERNAL_BPI_SUBJECT,
      'desc',
    );
    const ownerBpiSubject = new BpiSubject(
      '123',
      'owner',
      'ownerBpiSubject',
      [new PublicKey('321', PublicKeyType.EDDSA, eddsaPublicKey)],
      [role],
    );
    const fromBpiSubjectAccount = new BpiSubjectAccount(
      '123',
      ownerBpiSubject,
      ownerBpiSubject,
      'authenticationPolicy',
      'authorizationPolicy',
      'verifiableCredential',
      'recoveryKey',
    );
    const toBpiSubjectAccount = new BpiSubjectAccount(
      '123',
      ownerBpiSubject,
      ownerBpiSubject,
      'authenticationPolicy',
      'authorizationPolicy',
      'verifiableCredential',
      'recoveryKey',
    );

    const hashedPayload = crypto
      .createHash(`${process.env.MERKLE_TREE_HASH_ALGH}`)
      .update(JSON.stringify(payload))
      .digest();

    const eddsaSignature = eddsa.signPedersen(privateKey, hashedPayload);
    const packedSignature = eddsa.packSignature(eddsaSignature);
    const signature = Buffer.from(packedSignature).toString('hex');

    tx = new Transaction(
      '123',
      12,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      payload,
      signature,
      TransactionStatus.Initialized,
    );
  });

  it('creates witness for workstep1', async () => {
    const circuitName = 'workstep1';
    const pathToCircuit =
      './zeroKnowledgeArtifacts/circuits/workstep1/workstep1_js/workstep1.wasm';
    const pathToProvingKey =
      './zeroKnowledgeArtifacts/circuits/workstep1/workstep1_final.zkey';
    const pathToVerificationKey =
      './zeroKnowledgeArtifacts/circuits/workstep1/workstep1_verification_key.json';
    const pathToWitnessCalculator =
      '../../../../../../zeroKnowledgeArtifacts/circuits/workstep1/workstep1_js/witness_calculator';
    const pathToWitnessFile =
      './zeroKnowledgeArtifacts/circuits/workstep1/witness.txt';

    witness = await snarkjs.createWitness(
      tx,
      circuitName,
      pathToCircuit,
      pathToProvingKey,
      pathToVerificationKey,
      pathToWitnessCalculator,
      pathToWitnessFile,
    );
    expect(typeof witness).toEqual('object');
  });

  it('verifies witness for workstep1', async () => {
    const isVerified = await snarkjs.verifyProofUsingWitness(witness);
    expect(isVerified).toBe(true);
  });

  afterAll(() => {
    globalThis.curve_bn128.terminate();
  });
});
