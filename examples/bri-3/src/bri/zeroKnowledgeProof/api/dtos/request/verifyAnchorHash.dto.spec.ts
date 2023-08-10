import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { VerifyAnchorHashDto } from './verifyAnchorHash.dto';

describe('VerifyAnchorHashDto', () => {
  it('should return error in case inputForProofVerification not provided.', async () => {
    // Arrange
    const dto = {};
    const verifyAnchorHashDto = plainToInstance(VerifyAnchorHashDto, dto);

    // Act
    const errors = await validate(verifyAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('inputForProofVerification');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'inputForProofVerification ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      inputForProofVerification: 'This is test state',
    };
    const verifyAnchorHashDto = plainToInstance(VerifyAnchorHashDto, dto);

    // Act
    const errors = await validate(verifyAnchorHashDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
