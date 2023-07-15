import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateWorkflowDto } from './createWorkflow.dto';

describe('CreateWorkflowDto', () => {
  it('should return error in case name not provided.', async () => {
    // Arrange
    const dto = { workstepIds: ['1'], workgroupId: '1' };
    const createWorkflowDto = plainToInstance(CreateWorkflowDto, dto);

    // Act
    const errors = await validate(createWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('name');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'name should not be empty',
    );
  });

  it('should return error in case workgroupId not provided.', async () => {
    // Arrange
    const dto = { name: 'test', workstepIds: ['1'] };
    const createWorkflowDto = plainToInstance(CreateWorkflowDto, dto);

    // Act
    const errors = await validate(createWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('workgroupId');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'workgroupId should not be empty',
    );
  });

  it('should return error in case workstepIds not provided.', async () => {
    // Arrange
    const dto = { name: 'test', workgroupId: '1' };
    const createWorkflowDto = plainToInstance(CreateWorkflowDto, dto);

    // Act
    const errors = await validate(createWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('workstepIds');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'workstepIds should not be empty',
    );
  });

  it('should return error in case an empty workstepIds array is provided.', async () => {
    // Arrange
    const dto = { name: 'test', workstepIds: [], workgroupId: '1' };
    const createWorkflowDto = plainToInstance(CreateWorkflowDto, dto);

    // Act
    const errors = await validate(createWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('workstepIds');
    expect(errors[0].constraints?.arrayNotEmpty).toContain(
      'workstepIds should not be empty',
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = { name: 'test', workstepIds: ['1'], workgroupId: '1' };
    const createWorkflowDto = plainToInstance(CreateWorkflowDto, dto);

    // Act
    const errors = await validate(createWorkflowDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
