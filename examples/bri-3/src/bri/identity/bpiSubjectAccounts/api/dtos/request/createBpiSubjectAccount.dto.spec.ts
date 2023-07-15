import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../../shared/constants';
import { CreateBpiSubjectAccountDto } from './createBpiSubjectAccount.dto';

describe('CreateBpiSubjectAccountDto', () => {
  it('should return error in case required properties not provided.', async () => {
    // Arrange
    const dto = {};
    const createBpiSubjectAccountDto = plainToInstance(
      CreateBpiSubjectAccountDto,
      dto,
    );

    // Act
    const errors = await validate(createBpiSubjectAccountDto);

    // Assert
    expect(errors.length).toBe(2);
    expect(errors[0].property).toEqual('creatorBpiSubjectId');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'creatorBpiSubjectId ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
    expect(errors[1].property).toEqual('ownerBpiSubjectId');
    expect(errors[1].constraints?.isNotEmpty).toContain(
      'ownerBpiSubjectId ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerBpiSubjectId: '123',
      creatorBpiSubjectId: '321',
    };
    const createBpiSubjectAccountDto = plainToInstance(
      CreateBpiSubjectAccountDto,
      dto,
    );

    // Act
    const errors = await validate(createBpiSubjectAccountDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
