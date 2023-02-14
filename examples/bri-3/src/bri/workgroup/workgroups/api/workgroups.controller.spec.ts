import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { MockWorkgroupStorageAgent } from '../agents/mockWorkgroupStorage.agent';
import { WorkgroupAgent } from '../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../agents/workgroupStorage.agent';
import { CreateWorkgroupCommandHandler } from '../capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { DeleteWorkgroupCommandHandler } from '../capabilities/deleteWorkgroup/deleteWorkgroupCommand.handler';
import { GetWorkgroupByIdQueryHandler } from '../capabilities/getWorkgroupById/getWorkgroupByIdQuery.handler';
import { UpdateWorkgroupCommandHandler } from '../capabilities/updateWorkgroup/updateWorkgroupCommand.handler';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { UpdateWorkgroupDto } from './dtos/request/updateWorkgroup.dto';
import { WorkgroupController } from './workgroups.controller';
import { MockBpiSubjectStorageAgent } from '../../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubject } from '../../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectStorageAgent } from '../../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { WORKGROUP_NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { SubjectModule } from '../../../identity/bpiSubjects/subjects.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { BpiSubjectAgent } from '../../../identity/bpiSubjects/agents/bpiSubjects.agent';
import { ArchiveWorkgroupCommandHandler } from '../capabilities/archiveWorkgroup/archiveWorkgroupCommand.handler';
import { WorkgroupStatus } from '../models/workgroup';

describe('WorkgroupsController', () => {
  let workgroupController: WorkgroupController;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;
  let mockWorkgroupStorageAgent: MockWorkgroupStorageAgent;

  const workgroupRequestDto = {
    name: 'name',
    securityPolicy: 'sec',
    privacyPolicy: 'priv',
    workstepIds: [],
    workflowIds: [],
  } as CreateWorkgroupDto;

  const createTestBpiSubject = async () => {
    const newBpiSubject = new BpiSubject('123', 'name', 'desc', 'pubkey', []);
    return await mockBpiSubjectStorageAgent.createNewBpiSubject(newBpiSubject);
  };

  const createTestWorkgroup = async (): Promise<string> => {
    const bpiSubject = await createTestBpiSubject();
    const workgroupId = await workgroupController.createWorkgroup(
      { bpiSubject },
      workgroupRequestDto,
    );
    return workgroupId;
  };

  beforeEach(async () => {
    mockWorkgroupStorageAgent = new MockWorkgroupStorageAgent();
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        SubjectModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [WorkgroupController],
      providers: [
        WorkgroupAgent,
        BpiSubjectAgent,
        CreateWorkgroupCommandHandler,
        UpdateWorkgroupCommandHandler,
        ArchiveWorkgroupCommandHandler,
        DeleteWorkgroupCommandHandler,
        GetWorkgroupByIdQueryHandler,
        WorkgroupStorageAgent,
      ],
    })
      .overrideProvider(WorkgroupStorageAgent)
      .useValue(mockWorkgroupStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    workgroupController = app.get<WorkgroupController>(WorkgroupController);
    await app.init();
  });

  describe('getWorkgroupById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await workgroupController.getWorkgroupById(nonExistentId);
      }).rejects.toThrow(
        new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should return the correct workgroup if proper id passed ', async () => {
      // Arrange
      const newWorkgroupId = await createTestWorkgroup();

      // Act
      const createdWorkgroup = await workgroupController.getWorkgroupById(
        newWorkgroupId,
      );

      // Assert
      expect(createdWorkgroup.id).toEqual(newWorkgroupId);
    });
  });

  describe('createWorkgroup', () => {
    it('should return new uuid from the created workgroup when all necessary params provided', async () => {
      // Arrange
      // Act
      const newWorkgroupId = await createTestWorkgroup();
      const newWorkgroup = await workgroupController.getWorkgroupById(
        newWorkgroupId,
      );
      // Assert
      expect(newWorkgroupId).toEqual(newWorkgroup.id);
      expect(uuidValidate(newWorkgroupId));
      expect(uuidVersion(newWorkgroupId)).toEqual(4);
    });
  });

  describe('updateWorkgroup', () => {
    it('should throw NotFound if non existent id passed', async () => {
      // Arrange
      const nonExistentId = '123';
      const newBpiSubject = await createTestBpiSubject();

      const requestDto: UpdateWorkgroupDto = {
        name: 'name',
        administratorIds: [newBpiSubject.id],
        securityPolicy: 'sec',
        privacyPolicy: 'priv',
        participantIds: [newBpiSubject.id],
      };

      // Act and assert
      expect(async () => {
        await workgroupController.updateWorkgroup(nonExistentId, requestDto);
      }).rejects.toThrow(
        new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const newBpiSubject = await createTestBpiSubject();
      const newWorkgroupId = await createTestWorkgroup();
      const updateRequestDto: UpdateWorkgroupDto = {
        name: 'name',
        administratorIds: [newBpiSubject.id],
        securityPolicy: 'sec',
        privacyPolicy: 'priv',
        participantIds: [newBpiSubject.id],
      };

      // Act
      await workgroupController.updateWorkgroup(
        newWorkgroupId,
        updateRequestDto,
      );

      // Assert
      const updatedWorkgroup = await workgroupController.getWorkgroupById(
        newWorkgroupId,
      );
      expect(updatedWorkgroup.id).toEqual(newWorkgroupId);
      expect(updatedWorkgroup.administrators.map((ws) => ws.id)).toEqual(
        updateRequestDto.administratorIds,
      );
      expect(updatedWorkgroup.participants.map((p) => p.id)).toEqual(
        updateRequestDto.participantIds,
      );
      expect(updatedWorkgroup.name).toEqual(updateRequestDto.name);
    });
  });

  describe('archiveWorkgroup', () => {
    it('should throw NotFound if non existent id passed', async () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await workgroupController.archiveWorkgroup(nonExistentId);
      }).rejects.toThrow(
        new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const newWorkgroupId = await createTestWorkgroup();

      // Act
      await workgroupController.archiveWorkgroup(newWorkgroupId);

      // Assert
      const archivedWorkgroup = await workgroupController.getWorkgroupById(
        newWorkgroupId,
      );
      expect(archivedWorkgroup.id).toEqual(newWorkgroupId);
      expect(archivedWorkgroup.status).toEqual(WorkgroupStatus.ARCHIVED);
    });
  });

  describe('deleteWorkgroup', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await workgroupController.deleteWorkgroup(nonExistentId);
      }).rejects.toThrow(
        new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const newWorkgroupId = await createTestWorkgroup();

      // Act
      await workgroupController.deleteWorkgroup(newWorkgroupId);

      // Assert
      expect(async () => {
        await workgroupController.getWorkgroupById(newWorkgroupId);
      }).rejects.toThrow(
        new NotFoundException(WORKGROUP_NOT_FOUND_ERR_MESSAGE),
      );
    });
  });
});
