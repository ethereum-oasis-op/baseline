import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../../shared/constants';
import { CreateWorkstepDto } from './createWorkstep.dto';

describe('CreateWorkstepDto', () => {
  it('should return error in case name not provided.', async () => {
    // Arrange
    const dto = { workgroupId: '1' };
    const createWorkstepDto = plainToInstance(CreateWorkstepDto, dto);

    // Act
    const errors = await validate(createWorkstepDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('name');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'name ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case workgroupId not provided.', async () => {
    // Arrange
    const dto = { name: 'test' };
    const createWorkstepDto = plainToInstance(CreateWorkstepDto, dto);

    // Act
    const errors = await validate(createWorkstepDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('workgroupId');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'workgroupId ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = { name: 'test', workgroupId: '1' };
    const createWorkstepDto = plainToInstance(CreateWorkstepDto, dto);

    // Act
    const errors = await validate(createWorkstepDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
