import { SpartanCircuitService } from './spartan.service';
import { Transaction } from '../../../../transactions/models/transaction';
import { TransactionStatus } from '../../../../transactions/models/transactionStatus.enum';
import { BpiSubjectAccount } from '../../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../../../../identity/bpiSubjects/models/bpiSubject';
import {
  BpiSubjectRole,
  BpiSubjectRoleName,
} from '../../../../identity/bpiSubjects/models/bpiSubjectRole';
import { Witness } from '../../../models/witness';
import { ethers } from 'ethers';

describe('SpartanService', () => {
  const spartan = new SpartanCircuitService();
  let inputs: any;
  let witness: Witness;

  beforeAll(async () => {
    const wallet = ethers.Wallet.createRandom();
    const publicKey = wallet.publicKey;
    const msg = 'Test message';
    const signature = await wallet.signMessage(msg);

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
      publicKey,
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
    const tx: Transaction = new Transaction(
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

    inputs = { tx };
  });

  it('creates witness for workstep1', async () => {
    const circuitName = 'workstep1';
    const pathToCircuit =
      './zeroKnowledgeArtifacts/circuits/workstep1/workstep1.circuit';
    const pathToCircuitWasm =
      './zeroKnowledgeArtifacts/circuits/workstep1/workstep1_js/workstep1.wasm';

    witness = await spartan.createWitness(
      inputs,
      circuitName,
      pathToCircuit,
      pathToCircuitWasm,
    );
    expect(typeof witness).toEqual('object');
  });

  it('verifies witness for workstep1', async () => {
    const isVerified = await spartan.verifyProofUsingWitness(witness);
    expect(isVerified).toBe(true);
  });
});
