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
import { MockWorkflowStorageAgent } from '../agents/mockWorkflowStorage.agent';
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';
import { WorkstepModule } from '../../worksteps/worksteps.module';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
import { MockWorkstepStorageAgent } from '../../worksteps/agents/mockWorkstepsStorage.agent';
import { Workstep } from '../../worksteps/models/workstep';
import { Mapper } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { WorkflowProfile } from '../workflow.profile';
import { WorkstepProfile } from '../../worksteps/workstep.profile';

describe('WorkflowsController', () => {
  let workflowController: WorkflowController;
  let mockWorkstepStorageAgent: MockWorkstepStorageAgent;
  let mapper: Mapper;

  const workflowRequestDto = {
    name: 'name1',
    workstepIds: [],
    workgroupId: 'workgroup1',
  } as CreateWorkflowDto;

  const createTestWorkstep = async () => {
    const newWorkstep = new Workstep(
      '123',
      'name',
      'version',
      'status',
      'wgid',
      'secPolicy',
      'privPolicy',
    );
    return await mockWorkstepStorageAgent.createNewWorkstep(newWorkstep);
  };

  const createTestWorkflow = async (): Promise<string> => {
    const newWorkstep = await createTestWorkstep();
    workflowRequestDto.workstepIds = [newWorkstep.id];
    const workflowId = await workflowController.createWorkflow(
      workflowRequestDto,
    );
    return workflowId;
  };

  beforeEach(async () => {
    mockWorkstepStorageAgent = new MockWorkstepStorageAgent(mapper);
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
      .useValue(new MockWorkflowStorageAgent(mapper))
      .overrideProvider(WorkstepStorageAgent)
      .useValue(mockWorkstepStorageAgent)
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
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
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
      expect(createdWorkflow.worksteps.map((ws) => ws.id)).toEqual(
        workflowRequestDto.workstepIds,
      );
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
      const workflowRequestDto2 = {
        name: 'name2',
        workstepIds: [],
        workgroupId: 'workgroupId2',
      } as CreateWorkflowDto;

      const workflowId = await createTestWorkflow();
      const workstep = await createTestWorkstep();
      workflowRequestDto2.workstepIds = [workstep.id];

      const newWorkflowId2 = await workflowController.createWorkflow(
        workflowRequestDto2,
      );

      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows.length).toEqual(2);
      expect(workflows[0].id).toEqual(workflowId);
      expect(workflows[0].worksteps.map((ws) => ws.id)).toEqual(
        workflowRequestDto.workstepIds,
      );
      expect(workflows[1].id).toEqual(newWorkflowId2);
      expect(workflows[1].worksteps.map((ws) => ws.id)).toEqual(
        workflowRequestDto2.workstepIds,
      );
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
        workstepIds: ['worsktep1'],
        workgroupId: 'workgroupId1',
      };

      // Act and assert
      expect(async () => {
        await workflowController.updateWorkflow(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const workstep = await createTestWorkstep();

      const workflowId = await createTestWorkflow();
      const updateRequestDto: UpdateWorkflowDto = {
        name: 'name2',
        workstepIds: [workstep.id],
        workgroupId: 'workgroupId2',
      };

      // Act
      await workflowController.updateWorkflow(workflowId, updateRequestDto);

      // Assert
      const updatedWorkflow = await workflowController.getWorkflowById(
        workflowId,
      );
      expect(updatedWorkflow.id).toEqual(workflowId);
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
      // Act and assert
      expect(async () => {
        await workflowController.deleteWorkflow(nonExistentId);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const workflowId = await createTestWorkflow();

      // Act
      await workflowController.deleteWorkflow(workflowId);

      // Assert
      expect(async () => {
        await workflowController.getWorkflowById(workflowId);
      }).rejects.toThrow(new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE));
    });
  });
});
