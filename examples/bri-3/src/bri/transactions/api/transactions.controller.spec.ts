import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { TransactionController } from './transactions.controller';
import { TransactionAgent } from '../agents/transactions.agent';
import { CreateTransactionCommandHandler } from '../capabilities/createTransaction/createTransactionCommand.handler';
import { UpdateTransactionCommandHandler } from '../capabilities/updateTransaction/updateTransactionCommand.handler';
import { DeleteTransactionCommandHandler } from '../capabilities/deleteTransaction/deleteTransactionCommand.handler';
import { GetTransactionByIdQueryHandler } from '../capabilities/getTransactionById/getTransactionByIdQuery.handler';
import { TransactionStorageAgent } from '../agents/transactionStorage.agent';
import { CreateTransactionDto } from './dtos/request/createTransaction.dto';
import { UpdateTransactionDto } from './dtos/request/updateTransaction.dto';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { TransactionsProfile } from '../transactions.profile';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { MockBpiSubjectAccountsStorageAgent } from '../../identity/bpiSubjectAccounts/agents/mockBpiSubjectAccountsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubjectAccountStorageAgent } from '../../identity/bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountAgent } from '../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionStorageAgentMock: DeepMockProxy<TransactionStorageAgent>;
  let mockBpiSubjectAccountsStorageAgent: MockBpiSubjectAccountsStorageAgent;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;

  const createBpiSubjectAccount = async (id: string) => {
    const ownerBpiSubject = await mockBpiSubjectStorageAgent.storeNewBpiSubject(
      new BpiSubject('123', 'owner', 'desc', 'publicKey', []),
    );
    const creatorBpiSubject =
      await mockBpiSubjectStorageAgent.storeNewBpiSubject(
        new BpiSubject('321', 'creator', 'desc', 'publicKey', []),
      );

    return mockBpiSubjectAccountsStorageAgent.storeNewBpiSubjectAccount(
      new BpiSubjectAccount(
        id,
        creatorBpiSubject,
        ownerBpiSubject,
        'sample',
        'sample',
        'sample',
        'sample',
      ),
    );
  };

  beforeEach(async () => {
    mockBpiSubjectAccountsStorageAgent =
      new MockBpiSubjectAccountsStorageAgent();
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [TransactionController],
      providers: [
        TransactionAgent,
        CreateTransactionCommandHandler,
        UpdateTransactionCommandHandler,
        DeleteTransactionCommandHandler,
        GetTransactionByIdQueryHandler,
        TransactionStorageAgent,
        TransactionsProfile,
        BpiSubjectAccountStorageAgent,
        BpiSubjectAccountAgent,
        BpiSubjectStorageAgent,
      ],
    })
      .overrideProvider(TransactionStorageAgent)
      .useValue(mockDeep<TransactionStorageAgent>())
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(mockBpiSubjectAccountsStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    controller = app.get<TransactionController>(TransactionController);
    transactionStorageAgentMock = app.get(TransactionStorageAgent);
    await app.init();
  });

  describe('getTransactionById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      transactionStorageAgentMock.getTransactionById.mockResolvedValueOnce(
        undefined,
      );

      // Act and assert
      expect(async () => {
        await controller.getTransactionById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct transaction if proper id passed ', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const existingTransaction = new Transaction(
        '123',
        1,
        '42',
        '24',
        fromBpiSubjectAccount,
        toBpiSubjectAccount,
        'payload1',
        'signature',
        TransactionStatus.Initialized,
      );
      transactionStorageAgentMock.getTransactionById.mockResolvedValueOnce(
        existingTransaction,
      );

      // Act
      const fetchedTransaction = await controller.getTransactionById(
        existingTransaction.id,
      );

      // Assert
      expect(fetchedTransaction.id).toEqual(existingTransaction.id);
      expect(fetchedTransaction.nonce).toEqual(existingTransaction.nonce);
      expect(fetchedTransaction.workflowInstanceId).toEqual(
        existingTransaction.workflowInstanceId,
      );
      expect(fetchedTransaction.workstepInstanceId).toEqual(
        existingTransaction.workstepInstanceId,
      );
      expect(uuidValidate(fetchedTransaction.fromBpiSubjectAccountId));
      expect(uuidVersion(fetchedTransaction.fromBpiSubjectAccountId)).toEqual(
        4,
      );
      expect(uuidValidate(fetchedTransaction.toBpiSubjectAccountId));
      expect(uuidVersion(fetchedTransaction.toBpiSubjectAccountId)).toEqual(4);
      expect(fetchedTransaction.payload).toEqual(existingTransaction.payload);
      expect(fetchedTransaction.signature).toEqual(
        existingTransaction.signature,
      );
    });
  });

  describe('createTransaction', () => {
    it('should return new id from the created transaction when all params provided', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const requestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromSubjectAccountId: fromBpiSubjectAccount.id,
        toSubjectAccountId: toBpiSubjectAccount.id,
        payload: 'payload1',
        signature: 'signature1',
      } as CreateTransactionDto;

      const expectedTransaction = new Transaction(
        requestDto.id,
        requestDto.nonce,
        requestDto.workflowInstanceId,
        requestDto.workstepInstanceId,
        fromBpiSubjectAccount,
        toBpiSubjectAccount,
        requestDto.payload,
        requestDto.signature,
        TransactionStatus.Initialized,
      );

      transactionStorageAgentMock.storeNewTransaction.mockResolvedValueOnce(
        expectedTransaction,
      );

      // Act
      const response = await controller.createTransaction(requestDto);

      // Assert
      expect(response).toEqual(requestDto.id);
    });
  });

  describe('updateTransaction', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto = {
        payload: 'payload2',
        signature: 'signature2',
      } as UpdateTransactionDto;

      transactionStorageAgentMock.updateTransaction.mockRejectedValueOnce(
        undefined,
      );
      // Act and assert
      expect(async () => {
        await controller.updateTransaction(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const existingTransaction = new Transaction(
        '123',
        1,
        '42',
        '24',
        fromBpiSubjectAccount,
        toBpiSubjectAccount,
        'payload1',
        'signature',
        TransactionStatus.Initialized,
      );
      transactionStorageAgentMock.getTransactionById.mockResolvedValueOnce(
        existingTransaction,
      );

      const updateRequestDto = {
        payload: 'payload2',
        signature: 'signature2',
      } as UpdateTransactionDto;

      transactionStorageAgentMock.updateTransaction.mockResolvedValueOnce({
        ...existingTransaction,
        payload: updateRequestDto.payload,
        signature: updateRequestDto.signature,
      } as Transaction);

      // Act
      const updatedTransaction = await controller.updateTransaction(
        existingTransaction.id,
        updateRequestDto,
      );

      // Assert
      expect(updatedTransaction.id).toEqual(existingTransaction.id);
      expect(updatedTransaction.payload).toEqual(updateRequestDto.payload);
      expect(updatedTransaction.signature).toEqual(updateRequestDto.signature);
    });
  });

  describe('deleteTransaction', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      transactionStorageAgentMock.deleteTransaction.mockRejectedValueOnce(
        undefined,
      );
      // Act and assert
      expect(async () => {
        await controller.deleteTransaction(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const existingTransaction = new Transaction(
        '123',
        1,
        '42',
        '24',
        fromBpiSubjectAccount,
        toBpiSubjectAccount,
        'payload1',
        'signature',
        TransactionStatus.Initialized,
      );
      transactionStorageAgentMock.getTransactionById.mockResolvedValueOnce(
        existingTransaction,
      );

      // Act
      await controller.deleteTransaction(existingTransaction.id);
    });
  });
});
