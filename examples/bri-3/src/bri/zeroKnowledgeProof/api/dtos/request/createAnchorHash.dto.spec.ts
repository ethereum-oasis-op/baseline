import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { CreateAnchorHashDto } from './createAnchorHash.dto';

describe('CreateAnchorHashDto', () => {
  it('should return error in case ownerAccount is not provided.', async () => {
    // Arrange
    const dto = {
      state: 'This is test state',
    };
    const createAnchorHashDto = plainToInstance(CreateAnchorHashDto, dto);

    // Act
    const errors = await validate(createAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('ownerAccount');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'ownerAccount ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case state is not provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
    };
    const createAnchorHashDto = plainToInstance(CreateAnchorHashDto, dto);

    // Act
    const errors = await validate(createAnchorHashDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('state');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'state ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      ownerAccount: {},
      state: 'This is test state',
    };
    const createAnchorHashDto = plainToInstance(CreateAnchorHashDto, dto);

    // Act
    const errors = await validate(createAnchorHashDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
