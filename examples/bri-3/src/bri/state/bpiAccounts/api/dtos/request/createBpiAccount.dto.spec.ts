import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../../shared/constants';
import { CreateBpiAccountDto } from './createBpiAccount.dto';

describe('CreateBpiAccountDto', () => {
  it('should return error in case owners not provided.', async () => {
    // Arrange
    const dto = {};
    const createBpiAccountDto = plainToInstance(CreateBpiAccountDto, dto);

    // Act
    const errors = await validate(createBpiAccountDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('ownerBpiSubjectAccountsIds');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'ownerBpiSubjectAccountsIds ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerBpiSubjectAccountsIds: ['123'],
    };
    const createBpiAccountDto = plainToInstance(CreateBpiAccountDto, dto);

    // Act
    const errors = await validate(createBpiAccountDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
