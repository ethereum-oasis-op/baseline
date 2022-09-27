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
import { WorkflowStorageAgent } from '../agents/workflowsStorage.agent';
import { MockWorkflowStorageAgent } from '../agents/mockWorkflowStorage.agent';
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';

describe('WorkflowsController', () => {
  let workflowController: WorkflowController;
  // let worktepController: WorkstepController;

  // const workstepRequestDto = {
  //   name: 'name',
  //   version: 'version',
  //   status: 'status',
  //   workgroupId: 'wgid',
  //   securityPolicy: 'secPolicy',
  //   privacyPolicy: 'privPolicy',
  // } as CreateWorkstepDto;

  const workflowRequestDto = {
    name: 'name1',
    worksteps: [],
    workgroupId: 'workgroup1',
  } as CreateWorkflowDto;

  const createTestWorkflow = async (): Promise<string> => {
    const workflowId = await workflowController.createWorkflow(
      workflowRequestDto,
    );
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

    workflowController = app.get<WorkflowController>(WorkflowController);

    await app.init();
  });

  describe('getWorkflowById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await workflowController.getWorkflowById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workflow if proper id passed ', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();

      // Act
      const createdWorkflow = await workflowController.getWorkflowById(
        workflowId,
      );

      // Assert
      expect(createdWorkflow.id).toEqual(workflowId);
      expect(createdWorkflow.worksteps).toEqual(workflowRequestDto.worksteps);
    });
  });

  describe('getAllWorkflows', () => {
    it('should return empty array if no workflows', async () => {
      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows).toHaveLength(0);
    });

    it('should return 2 workflows if 2 exist', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();
      const requestDto2 = {
        name: 'name2',
        worksteps: [],
        workgroupId: 'workgroupId2',
      } as CreateWorkflowDto;
      const newWorkflowId2 = await workflowController.createWorkflow(
        requestDto2,
      );

      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows.length).toEqual(2);
      expect(workflows[0].id).toEqual(workflowId);
      expect(workflows[0].worksteps).toEqual(workflowRequestDto.worksteps);
      expect(workflows[1].id).toEqual(newWorkflowId2);
      expect(workflows[1].worksteps).toEqual(requestDto2.worksteps);
    });
  });

  describe('createWorkflow', () => {
    it('should return new uuid from the created workstep when all necessary params provided', async () => {
      let workflows = await workflowController.getAllWorkflows();
      expect(workflows).toEqual([]);

      // Arrange
      // Act
      const workflowId = await createTestWorkflow();
      workflows = await workflowController.getAllWorkflows();

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
      const requestDto: UpdateWorkflowDto = {
        name: 'name1',
        worksteps: [],
        workgroupId: 'workgroupId1',
      };

      // Act and assert
      expect(async () => {
        await workflowController.updateWorkflow(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();
      const updateRequestDto: UpdateWorkflowDto = {
        name: 'name1',
        worksteps: [],
        workgroupId: 'workgroupId1',
      };

      // Act
      await workflowController.updateWorkflow(workflowId, updateRequestDto);

      // Assert
      const updatedWorkflow = await workflowController.getWorkflowById(
        workflowId,
      );
      expect(updatedWorkflow.id).toEqual(workflowId);
      expect(updatedWorkflow.worksteps).toEqual(updateRequestDto.worksteps);
    });
  });

  describe('deleteWorkflow', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await workflowController.deleteWorkflow(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();

      // Act
      await workflowController.deleteWorkflow(workflowId);

      // Assert
      expect(async () => {
        await workflowController.getWorkflowById(workflowId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
