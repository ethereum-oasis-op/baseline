import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthAgent } from '../../auth/agent/auth.agent';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { WorkflowStorageAgent } from '../../workgroup/workflows/agents/workflowsStorage.agent';
import { WorkstepStorageAgent } from '../../workgroup/worksteps/agents/workstepsStorage.agent';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';
import { TransactionStorageAgent } from './transactionStorage.agent';
import { TransactionAgent } from './transactions.agent';

let transactionAgent: TransactionAgent;

let transactionStorageAgentMock: DeepMockProxy<TransactionStorageAgent> = mockDeep<TransactionStorageAgent>();
let workstepStorageAgentMock: DeepMockProxy<WorkstepStorageAgent> = mockDeep<WorkstepStorageAgent>();
let workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent> = mockDeep<WorkflowStorageAgent>();
let authAgentMock: DeepMockProxy<AuthAgent> = mockDeep<AuthAgent>();

let fromBpiSubjectAccount = new BpiSubjectAccount("1", null, null, "", "", "", "");
let toBpiSubjectAccount = new BpiSubjectAccount("2", null, null, "", "", "", "");

beforeAll(async () => {
  // TODO: https://github.com/prisma/prisma/issues/10203
  // transactionAgent = new TransactionAgent(transactionStorageAgentMock, workstepStorageAgentMock, workflowStorageAgentMock, authAgentMock);
});

describe('Transaction Agent', () => {
  it('Should return false when validateTransactionForExecution invoked with tx with non existent workflow id', () => {
    // Arrange
    const tx = new Transaction(
      "1", 
      1, 
      "123", 
      "123", 
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      "transaction payload", 
      "sig", 
      TransactionStatus.Processing);

    // Act
    // const validationResult =
    //   transactionAgent.validateTransactionForExecution(tx);

    // // Assert
    // expect(validationResult).toBeFalsy();
  });
});
