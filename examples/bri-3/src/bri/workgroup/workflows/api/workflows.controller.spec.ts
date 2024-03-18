import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { uuid } from 'uuidv4';
import { TestDataHelper } from '../../../../shared/testing/testData.helper';
import { BpiAccountAgent } from '../../../state/bpiAccounts/agents/bpiAccounts.agent';
import { BpiAccountStorageAgent } from '../../../state/bpiAccounts/agents/bpiAccountsStorage.agent';
import { BpiSubjectAccountAgent } from '../../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { NOT_FOUND_ERR_MESSAGE } from '../../workflows/api/err.messages';
import { WorkgroupAgent } from '../../workgroups/agents/workgroups.agent';
import { WorkstepStorageAgent } from '../../worksteps/agents/workstepsStorage.agent';
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
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('WorkflowsController', () => {
  let workflowController: WorkflowController;
  let workflowStorageAgentMock: DeepMockProxy<WorkflowStorageAgent>;
  let workgroupAgentMock: DeepMockProxy<WorkgroupAgent>;
  let bpiSubjectAccountAgentMock: DeepMockProxy<BpiSubjectAccountAgent>;
  let bpiAccountStorageAgentMock: DeepMockProxy<BpiAccountStorageAgent>;

  // TODO: #742 Setup of this test data below is what should be handled in a separate file where we mock only prisma.client
  // and implement various test data scenarios that can be selected with a single line of code.
  // https://github.com/demonsters/prisma-mock
  let existingWorkgroupId;
  let existingBpiSubject1;
  let existingBpiSubject2;
  let existingBpiSubjectAccount1;
  let existingBpiSubjectAccount2;
  let existingBpiAccount1;
  let existingWorkstep1;
  let existingWorkflow1;
  let existingWorkflow2;
  let existingWorkgroup;

  beforeEach(async () => {
    existingWorkgroupId = uuid();
    existingBpiSubject1 = TestDataHelper.createBpiSubject();
    existingBpiSubject2 = TestDataHelper.createBpiSubject();
    existingBpiSubjectAccount1 = TestDataHelper.createBpiSubjectAccount(
      existingBpiSubject1,
      existingBpiSubject1,
    );
    existingBpiSubjectAccount2 = TestDataHelper.createBpiSubjectAccount(
      existingBpiSubject2,
      existingBpiSubject2,
    );
    existingBpiAccount1 = TestDataHelper.createBpiAccount([
      existingBpiSubjectAccount1,
      existingBpiSubjectAccount2,
    ]);
    existingWorkstep1 = TestDataHelper.createTestWorkstep(existingWorkgroupId);
    existingWorkflow1 = TestDataHelper.createTestWorkflow(
      existingWorkgroupId,
      [existingWorkstep1],
      existingBpiAccount1,
    );
    existingWorkflow2 = TestDataHelper.createTestWorkflow(
      existingWorkgroupId,
      [existingWorkstep1],
      existingBpiAccount1,
    );
    existingWorkgroup = TestDataHelper.createWorkgroup(
      existingWorkgroupId,
      [existingBpiSubject1],
      [existingBpiSubject1, existingBpiSubject2],
      [existingWorkstep1],
      [existingWorkflow1],
    );

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
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    workflowController = app.get<WorkflowController>(WorkflowController);
    workflowStorageAgentMock = app.get(WorkflowStorageAgent);
    workgroupAgentMock = app.get(WorkgroupAgent);
    bpiSubjectAccountAgentMock = app.get(BpiSubjectAccountAgent);
    bpiAccountStorageAgentMock = app.get(BpiAccountStorageAgent);

    await app.init();
  });

  describe('getWorkflowById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      workflowStorageAgentMock.getWorkflowById.mockRejectedValueOnce(
        new NotFoundException(NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.getWorkflowById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workflow if proper id passed ', async () => {
      // Arrange
      const existingWorkflow = existingWorkflow1;
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
      workflowStorageAgentMock.getAllWorkflows.mockResolvedValueOnce([
        existingWorkflow1,
        existingWorkflow2,
      ]);

      // Act
      const workflows = await workflowController.getAllWorkflows();

      // Assert
      expect(workflows.length).toEqual(2);
      expect(workflows[0].id).toEqual(existingWorkflow1.id);
      expect(workflows[0].worksteps.map((ws) => ws.id)).toEqual(
        existingWorkflow1.worksteps.map((ws) => ws.id),
      );
      expect(workflows[1].id).toEqual(existingWorkflow2.id);
      expect(workflows[1].worksteps.map((ws) => ws.id)).toEqual(
        existingWorkflow2.worksteps.map((ws) => ws.id),
      );
    });
  });

  describe('createWorkflow', () => {
    it('should return new uuid from the created workflow when all necessary params provided', async () => {
      // Arrange

      workflowStorageAgentMock.storeNewWorkflow.mockResolvedValueOnce(
        existingWorkflow1,
      );
      workgroupAgentMock.fetchUpdateCandidateAndThrowIfUpdateValidationFails.mockResolvedValueOnce(
        existingWorkgroup,
      );

      bpiSubjectAccountAgentMock.getBpiSubjectAccountsAndThrowIfNotExist.mockResolvedValueOnce(
        [existingBpiSubjectAccount1, existingBpiSubjectAccount2],
      );

      bpiAccountStorageAgentMock.storeNewBpiAccount.mockResolvedValueOnce(
        existingBpiAccount1,
      );

      const requestDto = {
        name: existingWorkflow1.name,
        workstepIds: existingWorkflow1.worksteps.map((ws) => ws.id),
        workgroupId: existingWorkflow1.workgroupId,
      } as CreateWorkflowDto;

      // Act
      const response = await workflowController.createWorkflow(requestDto);

      // Assert
      expect(response).toEqual(existingWorkflow1.id);
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
        new NotFoundException(NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.updateWorkflow(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
        existingWorkflow1,
      );

      const updateRequestDto: UpdateWorkflowDto = {
        name: 'name2',
        workstepIds: existingWorkflow1.worksteps.map((ws) => ws.id),
        workgroupId: 'workgroupId2',
      };
      workflowStorageAgentMock.updateWorkflow.mockResolvedValueOnce({
        ...existingWorkflow1,
        workgroupId: updateRequestDto.workgroupId,
        name: updateRequestDto.name,
      } as Workflow);

      // Act
      const updatedWorkflow = await workflowController.updateWorkflow(
        existingWorkflow1.id,
        updateRequestDto,
      );

      // Assert
      expect(updatedWorkflow.id).toEqual(existingWorkflow1.id);
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
        new NotFoundException(NOT_FOUND_ERR_MESSAGE),
      );

      // Act and assert
      expect(async () => {
        await workflowController.deleteWorkflow(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      workflowStorageAgentMock.getWorkflowById.mockResolvedValueOnce(
        existingWorkflow1,
      );

      // Act
      await workflowController.deleteWorkflow(existingWorkflow1.id);
    });
  });
});
