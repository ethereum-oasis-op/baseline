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

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [TransactionController],
      providers: [
        TransactionAgent,
        CreateTransactionCommandHandler,
        UpdateTransactionCommandHandler,
        DeleteTransactionCommandHandler,
        GetTransactionByIdQueryHandler,
        TransactionStorageAgent,
      ],
    })
      .overrideProvider(TransactionStorageAgent)
      .useValue(new MockTransactionStorageAgent())
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
      const requestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromAccountId: 'from',
        toAccountId: 'to',
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
      expect(createdTransaction.from).toEqual(''); // TODO: Will be fixed with #489
      expect(createdTransaction.to).toEqual(''); // TODO: Will be fixed with #489
      expect(createdTransaction.payload).toEqual(requestDto.payload);
      expect(createdTransaction.signature).toEqual(requestDto.signature);
    });
  });

  describe('createTransaction', () => {
    it('should return new id from the created transaction when all params provided', async () => {
      // Arrange
      const requestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromAccountId: 'from',
        toAccountId: 'to',
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
      const createRequestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromAccountId: 'from',
        toAccountId: 'to',
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
      const createRequestDto = {
        id: '123',
        nonce: 1,
        workflowInstanceId: '42',
        workstepInstanceId: '24',
        fromAccountId: 'from',
        toAccountId: 'to',
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
