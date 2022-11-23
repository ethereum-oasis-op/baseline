import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { CreateCCSMAnchorHashDto } from './createCCSMAnchorHash.dto';

describe('CreateCCSMAnchorHashDto', () => {
  it('should return error in case ownerAccount is not provided.', async () => {
    // Arrange
    const dto = {
      agreementState: {},
      document: {},
      signature: '123',
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

  it('should return error in case agreementState not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: '123',
      document: {},
      signature: '123',
    };
    const createCCSMAnchorHashDto = plainToInstance(
      CreateCCSMAnchorHashDto,
      dto,
    );

    // Act
    const errors = await validate(createCCSMAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('agreementState');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'agreementState ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case document not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
      agreementState: {},
      signature: '123',
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

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
      agreementState: {},
      document: {
        documentObjectType: 'document',
        documentObjectInput: { input: 'This is a document' },
      },
    };
    const createCCSMAnchorHashDto = plainToInstance(
      CreateCCSMAnchorHashDto,
      dto,
    );

    // Act
    const errors = await validate(createCCSMAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'signature ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
      agreementState: {},
      document: {
        documentObjectType: 'document',
        documentObjectInput: { input: 'This is a document' },
      },
      signature: '123',
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
