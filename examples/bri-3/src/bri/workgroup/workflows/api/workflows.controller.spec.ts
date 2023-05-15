import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WORKFLOW_NOT_FOUND_ERR_MESSAGE } from '../../workflows/api/err.messages';
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
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';
import { WorkstepModule } from '../../worksteps/worksteps.module';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
import { Workstep } from '../../worksteps/models/workstep';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { WorkflowProfile } from '../workflow.profile';
import { WorkstepProfile } from '../../worksteps/workstep.profile';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Workflow } from '../models/workflow';
import { uuid } from 'uuidv4';

describe('WorkflowsController', () => {
  let workflowController: WorkflowController;
  let workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent>;

  const createTestWorkstep = () => {
    return new Workstep(
      '123',
      'name',
      'version',
      'status',
      'wgid',
      'secPolicy',
      'privPolicy',
    );
  };

  const createTestWorkflow = () => {
    const newWorkstep = createTestWorkstep();
    return new Workflow(uuid(), 'name', [newWorkstep], 'workgroup1');
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        WorkstepModule,
      ],
      controllers: [WorkflowController],
      providers: [
        WorkflowAgent,
        CreateWorkflowCommandHandler,
        UpdateWorkflowCommandHandler,
        DeleteWorkflowCommandHandler,
        GetWorkflowByIdQueryHandler,
        GetAllWorkflowsQueryHandler,
        WorkflowStorageAgent,
        WorkstepProfile,
        WorkflowProfile,
      ],
    })
      .overrideProvider(WorkflowStorageAgent)
      .useValue(mockDeep<WorkflowStorageAgent>())
      .overrideProvider(WorkstepStorageAgent)
      .useValue(mockDeep<WorkstepStorageAgent>())
      .compile();

    workflowController = app.get<WorkflowController>(WorkflowController);
    workflowStorageAgentMock = app.get(WorkflowStorageAgent);
    await app.init();
  });

  describe('getWorkflowById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      workflowStorageAgentMock.getWorkflowById.mockRejectedValueOnce(
        new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.getWorkflowById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workflow if proper id passed ', async () => {
      // Arrange
      const existingWorkflow = createTestWorkflow();
      workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
        existingWorkflow,
      );
      // Act
      const createdWorkflow = await workflowController.getWorkflowById(
        existingWorkflow.id,
      );

      // Assert
      expect(createdWorkflow.id).toEqual(existingWorkflow.id);
      expect(createdWorkflow.worksteps.map((ws) => ws.id)).toEqual(
        existingWorkflow.worksteps.map((ws) => ws.id),
      );
    });
  });

  describe('getAllWorkflows', () => {
    it('should return empty array if no workflows', async () => {
      // Arrange
      workflowStorageAgentMock.getAllWorkflows.mockResolvedValueOnce([]);

      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows).toHaveLength(0);
    });

    it('should return 2 workflows if 2 exist', async () => {
      // Arrange
      const workflow1 = createTestWorkflow();
      const workflow2 = createTestWorkflow();
      workflowStorageAgentMock.getAllWorkflows.mockResolvedValueOnce([
        workflow1,
        workflow2,
      ]);

      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows.length).toEqual(2);
      expect(workflows[0].id).toEqual(workflow1.id);
      expect(workflows[0].worksteps.map((ws) => ws.id)).toEqual(
        workflow1.worksteps.map((ws) => ws.id),
      );
      expect(workflows[1].id).toEqual(workflow2.id);
      expect(workflows[1].worksteps.map((ws) => ws.id)).toEqual(
        workflow2.worksteps.map((ws) => ws.id),
      );
    });
  });

  describe('createWorkflow', () => {
    it('should return new uuid from the created workstep when all necessary params provided', async () => {
      // Arrange
      const workflow = createTestWorkflow();
      workflowStorageAgentMock.createNewWorkflow.mockResolvedValueOnce(
        workflow,
      );
      const requestDto = {
        name: workflow.name,
        workstepIds: workflow.worksteps.map((ws) => ws.id),
        workgroupId: workflow.workgroupId,
      } as CreateWorkflowDto;
      // Act
      const response = await workflowController.createWorkflow(requestDto);

      // Assert
      expect(response).toEqual(workflow.id);
      expect(uuidValidate(response));
      expect(uuidVersion(response)).toEqual(4);
    });
  });

  describe('updateWorkflow', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto: UpdateWorkflowDto = {
        name: 'name1',
        workstepIds: ['worsktep1'],
        workgroupId: 'workgroupId1',
      };

      workflowStorageAgentMock.updateWorkflow.mockRejectedValueOnce(
        new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.updateWorkflow(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const existingWorkflow = createTestWorkflow();
      workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
        existingWorkflow,
      );

      const updateRequestDto: UpdateWorkflowDto = {
        name: 'name2',
        workstepIds: existingWorkflow.worksteps.map((ws) => ws.id),
        workgroupId: 'workgroupId2',
      };
      workflowStorageAgentMock.updateWorkflow.mockResolvedValueOnce({
        ...existingWorkflow,
        workgroupId: updateRequestDto.workgroupId,
        name: updateRequestDto.name,
      } as Workflow);

      // Act
      const updatedWorkflow = await workflowController.updateWorkflow(
        existingWorkflow.id,
        updateRequestDto,
      );

      // Assert
      expect(updatedWorkflow.id).toEqual(existingWorkflow.id);
      expect(updatedWorkflow.worksteps.map((ws) => ws.id)).toEqual(
        updateRequestDto.workstepIds,
      );
      expect(updatedWorkflow.workgroupId).toEqual(updateRequestDto.workgroupId);
      expect(updatedWorkflow.name).toEqual(updateRequestDto.name);
    });
  });

  describe('deleteWorkflow', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      workflowStorageAgentMock.updateWorkflow.mockRejectedValueOnce(
        new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.deleteWorkflow(nonExistentId);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const workflow = createTestWorkflow();
      workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(workflow);

      // Act
      await workflowController.deleteWorkflow(workflow.id);
    });
  });
});
