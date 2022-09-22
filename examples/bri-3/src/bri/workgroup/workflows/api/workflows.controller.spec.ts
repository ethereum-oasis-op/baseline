import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { NOT_FOUND_ERR_MESSAGE } from '../../workflows/api/err.messages';
import { WorkflowAgent } from '../agents/workflows.agent';
import { CreateWorkflowCommandHandler } from '../capabilities/createWorkflow/createWorkflowCommand.handler';
import { DeleteWorkflowCommandHandler } from '../capabilities/deleteWorkflow/deleteWorkflowCommand.handler';
import { GetAllWorkflowsQueryHandler } from '../capabilities/getAllWorkflows/getAllWorkflowsQuery.handler';
import { GetWorkflowByIdQueryHandler } from '../capabilities/getWorkflowById/getWorkflowByIdQuery.handler';
import { UpdateWorkflowCommandHandler } from '../capabilities/updateWorkflow/updateWorkflowCommand.handler';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';
import { WorkflowController } from './workflows.controller';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

describe('WorkflowsController', () => {
  let wController: WorkflowController;
  const requestDto = {
    workflows: ['workflow1', 'workflow2', 'workflow3'],
  } as CreateWorkflowDto;

  const createTestWorkflow = async (): Promise<string> => {
    const workflowId = await wController.createWorkflow(requestDto);
    return workflowId;
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkflowController],
      providers: [
        WorkflowAgent,
        CreateWorkflowCommandHandler,
        UpdateWorkflowCommandHandler,
        DeleteWorkflowCommandHandler,
        GetWorkflowByIdQueryHandler,
        GetAllWorkflowsQueryHandler,
        WorkflowStorageAgent,
      ],
    })
      .overrideProvider(WorkflowStorageAgent)
      .useValue(new MockWorkflowStorageAgent())
      .compile();

    wController = app.get<WorkflowController>(WorkflowController);

    await app.init();
  });

  describe('getWorkflowById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await wController.getWorkflowById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workflow if proper id passed ', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();

      // Act
      const createdWorkflow = await wController.getWorkflowById(workflowId);

      // Assert
      expect(createdWorkflow.id).toEqual(workflowId);
      expect(createdWorkflow.workflows).toEqual(requestDto.workflows);
    });
  });

  describe('getAllWorkflows', () => {
    it('should return empty array if no workflows', async () => {
      // Act
      const workflows = await wController.getAllWorkflows();

      // Assert
      expect(workflows).toHaveLength(0);
    });

    it('should return 2 workflows if 2 exist', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();
      const requestDto2 = {
        workflows: ['workflow3', 'workflow2', 'workflow1'],
      } as CreateWorkflowDto;
      const newWorkflowId2 = await wController.createWorkflow(requestDto2);

      // Act
      const workflows = await wController.getAllWorkflows();

      // Assert
      expect(workflows.length).toEqual(2);
      expect(workflows[0].id).toEqual(workflowId);
      expect(workflows[0].worksteps).toEqual(requestDto.worksteps);
      expect(workflows[1].id).toEqual(newWorkflowId2);
      expect(workflows[1].worksteps).toEqual(requestDto2.worksteps);
    });
  });

  describe('createWorkflow', () => {
    it('should return new uuid from the created workstep when all necessary params provided', async () => {
      let workflows = await wController.getAllWorkflows();
      expect(workflows).toEqual([]);

      // Arrange
      // Act
      const workflowId = await createTestWorkflow();
      workflows = await wController.getAllWorkflows();

      // Assert
      expect(workflows).toHaveLength(1);
      expect(uuidValidate(workflowId));
      expect(uuidVersion(workflowId)).toEqual(4);
    });
  });

  describe('updateWorkflow', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto: UpdateWorkstepDto = {
        workflows: ['workflow3', 'workflow2', 'workflow1'],
      };

      // Act and assert
      expect(async () => {
        await wController.updateWorkflow(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();
      const updateRequestDto: UpdateWorkstepDto = {
        workflows: ['workflow3', 'workflow2', 'workflow1'],
      };

      // Act
      await wController.updateWorkflow(workflowId, updateRequestDto);

      // Assert
      const updatedWorkflow = await wController.getWorkflowById(workflowId);
      expect(updatedWorkflow.id).toEqual(workflowId);
      expect(updatedWorkflow.workflow).toEqual(updateRequestDto.workflow);
    });
  });

  describe('deleteWorkflow', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await wController.deleteWorkflow(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();

      // Act
      await wController.deleteWorkflow(workflowId);

      // Assert
      expect(async () => {
        await wController.getWorkflowById(workflowId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
