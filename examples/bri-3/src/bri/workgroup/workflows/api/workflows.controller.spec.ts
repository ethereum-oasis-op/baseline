import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Workstep } from '../../worksteps/models/workstep';
import { WorkflowAgent } from '../agents/workflows.agent';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';
import { WorkflowController } from './workflows.controller';

describe('WorkflowsController', () => {
  let wController: WorkflowController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkflowController],
      providers: [WorkflowAgent, CreateWorkflowCommandHandler],
    }).compile();

    wController = app.get<WorkflowController>(WorkflowController);

    await app.init();
  });

  describe('Bpi Workflow creation', () => {
    it('should throw BadRequest if worksteps not provided', () => {
      // Arrange
      const requestDto = { worksteps: [] } as CreateWorkflowDto;

      // Act and assert
      expect(async () => {
        await wController.CreateWorkflow(requestDto);
      }).rejects.toThrow(new BadRequestException('Worksteps cannot be empty.'));
    });

    it('should return true if all input params provided', async () => {
      // Arrange
      const requestDto = {
        worksteps: [new Workstep('name', 'id', 'workgroupId')],
      } as CreateWorkflowDto;

      // Act
      const response = await wController.CreateWorkflow(requestDto);

      // Assert
      expect(response).toEqual(true);
    });
  });
});
