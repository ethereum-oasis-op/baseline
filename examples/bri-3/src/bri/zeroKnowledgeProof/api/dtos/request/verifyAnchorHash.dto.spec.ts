import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { VerifyAnchorHashDto } from './verifyAnchorHash.dto';

describe('VerifyAnchorHashDto', () => {
  it('should return error in case document not provided.', async () => {
    // Arrange
    const dto = { signature: '2323' };
    const verifyAnchorHashDto = plainToInstance(VerifyAnchorHashDto, dto);

    // Act
    const errors = await validate(verifyAnchorHashDto);

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
      document: {
        documentObjectType: 'document',
        documentObjectInput: { input: 'This is a document' },
      },
    };
    const verifyAnchorHashDto = plainToInstance(VerifyAnchorHashDto, dto);

    // Act
    const errors = await validate(verifyAnchorHashDto);

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
      document: {
        documentObjectType: 'document',
        documentObjectInput: { input: 'This is a document' },
      },
      signature: '2323',
    };
    const verifyAnchorHashDto = plainToInstance(VerifyAnchorHashDto, dto);

    // Act
    const errors = await validate(verifyAnchorHashDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
