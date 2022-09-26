import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateWorkflowDto } from './updateWorkflow.dto';

describe('UpdateWorkflowDto', () => {
  it('should return error in case name not provided.', async () => {
    // Arrange
    const dto = { workgroupId: '1' };
    const updateWorkflowDto = plainToInstance(UpdateWorkflowDto, dto);

    // Act
    const errors = await validate(updateWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('name');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'name should not be empty',
    );
  });

  it('should return error in case workgroupId not provided.', async () => {
    // Arrange
    const dto = { name: 'test' };
    const updateWorkflowDto = plainToInstance(UpdateWorkflowDto, dto);

    // Act
    const errors = await validate(updateWorkflowDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('workgroupId');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'workgroupId should not be empty',
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = { name: 'test', workgroupId: '1' };
    const updateWorkflowDto = plainToInstance(UpdateWorkflowDto, dto);

    // Act
    const errors = await validate(updateWorkflowDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
