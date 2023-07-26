import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { uuid } from 'uuidv4';
import { BpiAccountAgent } from '../../../identity/bpiAccounts/agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../../identity/bpiAccounts/agents/bpiAccountsStorage.agent';
import { BpiAccount } from '../../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccountAgent } from '../../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { WORKFLOW_NOT_FOUND_ERR_MESSAGE } from '../../workflows/api/err.messages';
import { WorkgroupAgent } from '../../workgroups/agents/workgroups.agent';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
import { Workstep } from '../../worksteps/models/workstep';
import { WorkstepProfile } from '../../worksteps/workstep.profile';
import { WorkstepModule } from '../../worksteps/worksteps.module';
import { WorkflowAgent } from '../agents/workflows.agent';
import { WorkflowStorageAgent } from '../agents/workflowsStorage.agent';
import { CreateWorkflowCommandHandler } from '../capabilities/createWorkflow/createWorkflowCommand.handler';
import { DeleteWorkflowCommandHandler } from '../capabilities/deleteWorkflow/deleteWorkflowCommand.handler';
import { GetAllWorkflowsQueryHandler } from '../capabilities/getAllWorkflows/getAllWorkflowsQuery.handler';
import { GetWorkflowByIdQueryHandler } from '../capabilities/getWorkflowById/getWorkflowByIdQuery.handler';
import { UpdateWorkflowCommandHandler } from '../capabilities/updateWorkflow/updateWorkflowCommand.handler';
import { Workflow } from '../models/workflow';
import { WorkflowProfile } from '../workflow.profile';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';
import { WorkflowController } from './workflows.controller';
import { Workgroup } from '../../workgroups/models/workgroup';

describe('WorkflowsController', () => {
  let workflowController: WorkflowController;
  let workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent>;
  let workgroupAgentMock: DeepMockProxy<WorkgroupAgent>;

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
    return new Workflow(
      uuid(),
      'name',
      [newWorkstep],
      'workgroup1',
      {} as unknown as BpiAccount,
    );
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
        WorkgroupAgent,
        BpiAccountAgent,
        BpiSubjectAccountAgent,
        CreateWorkflowCommandHandler,
        UpdateWorkflowCommandHandler,
        DeleteWorkflowCommandHandler,
        GetWorkflowByIdQueryHandler,
        GetAllWorkflowsQueryHandler,
        WorkflowStorageAgent,
        BpiAccountStorageAgent,
        WorkstepProfile,
        WorkflowProfile,
      ],
    })
      .overrideProvider(WorkflowStorageAgent)
      .useValue(mockDeep<WorkflowStorageAgent>())
      .overrideProvider(WorkstepStorageAgent)
      .useValue(mockDeep<WorkstepStorageAgent>())
      .overrideProvider(BpiAccountAgent)
      .useValue(mockDeep<BpiAccountAgent>())
      .overrideProvider(BpiSubjectAccountAgent)
      .useValue(mockDeep<BpiSubjectAccountAgent>())
      .overrideProvider(WorkgroupAgent)
      .useValue(mockDeep<WorkgroupAgent>())
      .overrideProvider(BpiAccountStorageAgent)
      .useValue(mockDeep<BpiAccountStorageAgent>())
      .compile();

    workflowController = app.get<WorkflowController>(WorkflowController);
    workflowStorageAgentMock = app.get(WorkflowStorageAgent);
    workgroupAgentMock = app.get(WorkgroupAgent);

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
    // TODO: mock prisma context avoiding the need to mock anything else  https://www.prisma.io/docs/guides/testing/unit-testing
    it.skip('should return new uuid from the created workflow when all necessary params provided', async () => {
      // Arrange
      const workflow = createTestWorkflow();

      workflowStorageAgentMock.storeNewWorkflow.mockResolvedValueOnce(workflow);
      workgroupAgentMock.fetchUpdateCandidateAndThrowIfUpdateValidationFails.mockResolvedValueOnce(
        { participants: [] } as unknown as Workgroup,
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
