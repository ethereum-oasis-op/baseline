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
import { MockTransactionStorageAgent } from '../agents/mockTransactionStorage.agent';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { TransactionsProfile } from '../transactions.profile';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { MockBpiSubjectAccountsStorageAgent } from '../../identity/bpiSubjectAccounts/agents/mockBpiSubjectAccountsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiSubjectAccountStorageAgent } from '../../identity/bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccountAgent } from '../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockBpiSubjectAccountsStorageAgent: MockBpiSubjectAccountsStorageAgent;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;

  const createBpiSubjectAccount = async (id: string) => {
    const ownerBpiSubject =
      await mockBpiSubjectStorageAgent.createNewBpiSubject(
        new BpiSubject(
          '123',
          'owner',
          'desc',
          BpiSubjectType.External,
          'publicKey',
        ),
      );
    const creatorBpiSubject =
      await mockBpiSubjectStorageAgent.createNewBpiSubject(
        new BpiSubject(
          '321',
          'creator',
          'desc',
          BpiSubjectType.External,
          'publicKey',
        ),
      );

    return mockBpiSubjectAccountsStorageAgent.createNewBpiSubjectAccount(
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
      .useValue(new MockTransactionStorageAgent())
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(mockBpiSubjectAccountsStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    controller = app.get<TransactionController>(TransactionController);

    await app.init();
  });

  describe('getTransactionById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await controller.getTransactionById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct transaction if proper id passed ', async () => {
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
        signature: 'signature',
      } as CreateTransactionDto;

      const newTransactionId = await controller.createTransaction(requestDto);

      // Act
      const createdTransaction = await controller.getTransactionById(
        newTransactionId,
      );

      // Assert
      expect(createdTransaction.id).toEqual(requestDto.id);
      expect(createdTransaction.nonce).toEqual(requestDto.nonce);
      expect(createdTransaction.workflowInstanceId).toEqual(
        requestDto.workflowInstanceId,
      );
      expect(createdTransaction.workstepInstanceId).toEqual(
        requestDto.workstepInstanceId,
      );
      expect(uuidValidate(createdTransaction.fromBpiSubjectAccountId));
      expect(uuidVersion(createdTransaction.fromBpiSubjectAccountId)).toEqual(
        4,
      );
      expect(uuidValidate(createdTransaction.toBpiSubjectAccountId));
      expect(uuidVersion(createdTransaction.toBpiSubjectAccountId)).toEqual(4);
      expect(createdTransaction.payload).toEqual(requestDto.payload);
      expect(createdTransaction.signature).toEqual(requestDto.signature);
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

      // Act and assert
      expect(async () => {
        await controller.updateTransaction(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const createRequestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromSubjectAccountId: fromBpiSubjectAccount.id,
        toSubjectAccountId: toBpiSubjectAccount.id,
        payload: 'payload1',
        signature: 'signature1',
      } as CreateTransactionDto;
      const newTransactionId = await controller.createTransaction(
        createRequestDto,
      );
      const updateRequestDto = {
        payload: 'payload2',
        signature: 'signature2',
      } as UpdateTransactionDto;

      // Act
      await controller.updateTransaction(newTransactionId, updateRequestDto);

      // Assert
      const updatedTransaction = await controller.getTransactionById(
        newTransactionId,
      );
      expect(updatedTransaction.id).toEqual(newTransactionId);
      expect(updatedTransaction.payload).toEqual(updateRequestDto.payload);
      expect(updatedTransaction.signature).toEqual(updateRequestDto.signature);
    });
  });

  describe('deleteTransaction', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await controller.deleteTransaction(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const fromBpiSubjectAccount = await createBpiSubjectAccount('123');
      const toBpiSubjectAccount = await createBpiSubjectAccount('321');

      const createRequestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromSubjectAccountId: fromBpiSubjectAccount.id,
        toSubjectAccountId: toBpiSubjectAccount.id,
        payload: 'payload1',
        signature: 'signature1',
      } as CreateTransactionDto;
      const newTransactionId = await controller.createTransaction(
        createRequestDto,
      );

      // Act
      await controller.deleteTransaction(newTransactionId);

      // Assert
      expect(async () => {
        await controller.getTransactionById(newTransactionId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
