import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { CreateProofDto } from './createProof.dto';

describe('CreateProofDto', () => {
  it('should return error in case document not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccountId: '123',
      signature: '123',
    };
    const createProofDto = plainToInstance(CreateProofDto, dto);

    // Act
    const errors = await validate(createProofDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('document');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'document ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = { document: 'this is a description' };
    const createProofDto = plainToInstance(CreateProofDto, dto);

    // Act
    const errors = await validate(createProofDto);

    // Assert
    expect(errors.length).toBe(2);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'signature ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerAccountId: '123',
      document: '123',
      signature: '123',
    };
    const createProofDto = plainToInstance(CreateProofDto, dto);

    // Act
    const errors = await validate(createProofDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
