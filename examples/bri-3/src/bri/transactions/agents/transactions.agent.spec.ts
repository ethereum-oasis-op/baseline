import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { uuid } from 'uuidv4';
import { ICircuitService } from '../../../bri/zeroKnowledgeProof/services/circuit/circuitService.interface';
import { TestDataHelper } from '../../../shared/testing/testData.helper';
import { AuthAgent } from '../../auth/agent/auth.agent';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { WorkflowStorageAgent } from '../../workgroup/workflows/agents/workflowsStorage.agent';
import { WorkstepStorageAgent } from '../../workgroup/worksteps/agents/workstepsStorage.agent';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';
import { TransactionStorageAgent } from './transactionStorage.agent';
import { TransactionAgent } from './transactions.agent';
import { MerkleTreeService } from '../../merkleTree/services/merkleTree.service';
import { PublicKey } from '../../identity/bpiSubjects/models/publicKey';

let transactionAgent: TransactionAgent;

const transactionStorageAgentMock: DeepMockProxy<TransactionStorageAgent> =
  mockDeep<TransactionStorageAgent>();
const workstepStorageAgentMock: DeepMockProxy<WorkstepStorageAgent> =
  mockDeep<WorkstepStorageAgent>();
const workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent> =
  mockDeep<WorkflowStorageAgent>();
const authAgentMock: DeepMockProxy<AuthAgent> = mockDeep<AuthAgent>();
const merkleTreeServiceMock: DeepMockProxy<MerkleTreeService> =
  mockDeep<MerkleTreeService>();
const circuitsServiceMock: DeepMockProxy<ICircuitService> =
  mockDeep<ICircuitService>();

// TODO: #742 Setup of this test data below is what should be handled in a separate file where we mock only prisma.client
// and implement various test data scenarios that can be selected with a single line of code.
// https://github.com/demonsters/prisma-mock
const existingWorkgroupId = uuid();

const existingBpiSubjectPublicKey: PublicKey = {
  ecdsa:
    '0x047a197a795a747c154dd92b217a048d315ef9ca1bfa9c15bfefe4e02fb338a70af23e7683b565a8dece5104a85ed24a50d791d8c5cb09ee21aabc927c98516539',
  eddsa:
    '0x047a197a795a747c154dd92b217a048d315ef9ca1bfa9c15bfefe4e02fb338a70af23e7683b565a8dece5104a85ed24a50d791d8c5cb09ee21aabc927c98516539',
};

const existingBpiSubject1 = new BpiSubject(
  '',
  'name',
  'desc',
  existingBpiSubjectPublicKey,
  [],
);
const existingBpiSubject2 = new BpiSubject(
  '',
  'name2',
  'desc2',
  existingBpiSubjectPublicKey,
  [],
);

const fromBpiSubjectAccount = new BpiSubjectAccount(
  '1',
  existingBpiSubject1,
  existingBpiSubject1,
  '',
  '',
  '',
  '',
);
const toBpiSubjectAccount = new BpiSubjectAccount(
  '2',
  existingBpiSubject2,
  existingBpiSubject2,
  '',
  '',
  '',
  '',
);

const existingBpiAccount1 = TestDataHelper.createBpiAccount([
  fromBpiSubjectAccount,
]);
const existingWorkstep1 =
  TestDataHelper.createTestWorkstep(existingWorkgroupId);
const existingWorkflow1 = TestDataHelper.createTestWorkflow(
  existingWorkgroupId,
  [existingWorkstep1],
  existingBpiAccount1,
);

beforeAll(async () => {
  // TODO: #742 https://github.com/prisma/prisma/issues/10203
  transactionAgent = new TransactionAgent(
    transactionStorageAgentMock,
    workstepStorageAgentMock,
    workflowStorageAgentMock,
    authAgentMock,
    merkleTreeServiceMock,
    circuitsServiceMock,
  );
});

describe('Transaction Agent', () => {
  it('Should return false when validateTransactionForExecution invoked with tx with non existent workflow id', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(undefined);

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with non existent workstep id', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(undefined);

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with non existent fromBpiSubjectAccount', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      undefined as unknown as BpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with non existent toBpiSubjectAccount', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      undefined as unknown as BpiSubjectAccount,
      'transaction payload',
      'sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with wrong signature', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    authAgentMock.verifyEddsaSignatureAgainstPublicKey.mockResolvedValue(false);

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'wrong sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with status not processing', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    authAgentMock.verifyEddsaSignatureAgainstPublicKey.mockResolvedValue(true);

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'correct sig',
      TransactionStatus.Executed,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return false when validateTransactionForExecution invoked with tx with nonce not  bpi account nonce +  1', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    authAgentMock.verifyEddsaSignatureAgainstPublicKey.mockResolvedValue(true);

    const tx = new Transaction(
      '1',
      999,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'correct sig',
      TransactionStatus.Executed,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeFalsy();
  });

  it('Should return true when validateTransactionForExecution invoked with tx with all properties correctly set', async () => {
    // Arrange
    workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
      existingWorkflow1,
    );

    workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
      existingWorkstep1,
    );

    authAgentMock.verifyEddsaSignatureAgainstPublicKey.mockResolvedValue(true);

    const tx = new Transaction(
      '1',
      1,
      '123',
      '123',
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      'transaction payload',
      'correct sig',
      TransactionStatus.Processing,
    );

    // Act
    const validationResult =
      await transactionAgent.validateTransactionForExecution(tx);

    // Assert
    expect(validationResult).toBeTruthy();
  });
});
