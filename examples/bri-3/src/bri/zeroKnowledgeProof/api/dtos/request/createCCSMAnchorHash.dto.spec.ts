import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { CreateCCSMAnchorHashDto } from './createCCSMAnchorHash.dto';

describe('CreateCCSMAnchorHashDto', () => {
  it('should return error in case ownerAccount is not provided.', async () => {
    // Arrange
    const dto = {
      document: 'This is test document',
    };
    const createCCSMAnchorHashDto = plainToInstance(
      CreateCCSMAnchorHashDto,
      dto,
    );

    // Act
    const errors = await validate(createCCSMAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('ownerAccount');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'ownerAccount ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case document not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
    };
    const createCCSMAnchorHashDto = plainToInstance(
      CreateCCSMAnchorHashDto,
      dto,
    );

    // Act
    const errors = await validate(createCCSMAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('document');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'document ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
      document: 'This test document',
    };
    const createCCSMAnchorHashDto = plainToInstance(
      CreateCCSMAnchorHashDto,
      dto,
    );

    // Act
    const errors = await validate(createCCSMAnchorHashDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
