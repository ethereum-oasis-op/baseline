import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { UpdateTransactionDto } from './updateTransaction.dto';

describe('UpdateTransactionDto', () => {
  it('should return error in case payload not provided.', async () => {
    // Arrange
    const dto = { signature: '2323' };
    const updateTransactionDto = plainToInstance(UpdateTransactionDto, dto);

    // Act
    const errors = await validate(updateTransactionDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('payload');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'payload ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = { payload: 'this is a description' };
    const updateTransactionDto = plainToInstance(UpdateTransactionDto, dto);

    // Act
    const errors = await validate(updateTransactionDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'signature ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = { payload: 'this is a description', signature: '2323' };
    const updateTransactionDto = plainToInstance(UpdateTransactionDto, dto);

    // Act
    const errors = await validate(updateTransactionDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
