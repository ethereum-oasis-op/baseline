import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthAgent } from '../../auth/agent/auth.agent';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { WorkflowStorageAgent } from '../../workgroup/workflows/agents/workflowsStorage.agent';
import { WorkstepStorageAgent } from '../../workgroup/worksteps/agents/workstepsStorage.agent';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';
import { TransactionStorageAgent } from './transactionStorage.agent';
import { TransactionAgent } from './transactions.agent';

let transactionAgent: TransactionAgent;

const transactionStorageAgentMock: DeepMockProxy<TransactionStorageAgent> =
  mockDeep<TransactionStorageAgent>();
const workstepStorageAgentMock: DeepMockProxy<WorkstepStorageAgent> =
  mockDeep<WorkstepStorageAgent>();
const workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent> =
  mockDeep<WorkflowStorageAgent>();
const authAgentMock: DeepMockProxy<AuthAgent> = mockDeep<AuthAgent>();

const existingBpiSubject1 = new BpiSubject(
  '',
  'name',
  'desc',
  '0x08872e27BC5d78F1FC4590803369492868A1FCCb',
  [],
);
const existingBpiSubject2 = new BpiSubject(
  '',
  'name2',
  'desc2',
  '0xF58e44db895C0fa1ca97d68E2F9123B187b789d4',
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

beforeAll(async () => {
  // TODO: https://github.com/prisma/prisma/issues/10203
  transactionAgent = new TransactionAgent(
    transactionStorageAgentMock,
    workstepStorageAgentMock,
    workflowStorageAgentMock,
    authAgentMock,
  );
});

describe('Transaction Agent', () => {
  it('Should return false when validateTransactionForExecution invoked with tx with non existent workflow id', async () => {
    // Arrange
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
});
