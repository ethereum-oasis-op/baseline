import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateTransactionDto } from './createTransaction.dto';

describe('CreateTransactionDto', () => {
  it('should return error in case id not provided.', async () => {
    // Arrange
    const dto = {
      nonce: 123,
      workflowInstanceId: '123',
      workstepInstanceId: '123',
      fromAccountId: '123',
      toAccountId: '123',
      payload: '123',
      signature: '123',
    };
    const createTransactionDto = plainToInstance(CreateTransactionDto, dto);

    // Act
    const errors = await validate(createTransactionDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('id');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'id should not be empty',
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      id: '123',
      nonce: 123,
      workflowInstanceId: '123',
      workstepInstanceId: '123',
      fromAccountId: '123',
      toAccountId: '123',
      payload: '123',
      signature: '123',
    };
    const createTransactionDto = plainToInstance(CreateTransactionDto, dto);

    // Act
    const errors = await validate(createTransactionDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
