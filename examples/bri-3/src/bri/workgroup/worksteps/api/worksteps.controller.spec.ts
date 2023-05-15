import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkstepAgent } from '../agents/worksteps.agent';
import { CreateWorkstepCommandHandler } from '../capabilities/createWorkstep/createWorkstepCommand.handler';
import { DeleteWorkstepCommandHandler } from '../capabilities/deleteWorkstep/deleteWorkstepCommand.handler';
import { GetAllWorkstepsQueryHandler } from '../capabilities/getAllWorksteps/getAllWorkstepsQuery.handler';
import { GetWorkstepByIdQueryHandler } from '../capabilities/getWorkstepById/getWorkstepByIdQuery.handler';
import { UpdateWorkstepCommandHandler } from '../capabilities/updateWorkstep/updateWorkstep.command.handler';
import { WorkstepStorageAgent } from '../agents/workstepsStorage.agent';
import { CreateWorkstepDto } from './dtos/request/createWorkstep.dto';
import { UpdateWorkstepDto } from './dtos/request/updateWorkstep.dto';
import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { WorkstepController } from './worksteps.controller';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { WorkstepProfile } from '../workstep.profile';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Workstep } from '../models/workstep';
import { uuid } from 'uuidv4';

describe('WorkstepController', () => {
  let wController: WorkstepController;
  let workstepStorageAgentMock: DeepMockProxy<WorkstepStorageAgent>;

  const createTestWorkstep = () => {
    return new Workstep(
      uuid(),
      'name',
      'version',
      'status',
      'wgid',
      'secPolicy',
      'privPolicy',
    );
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [WorkstepController],
      providers: [
        WorkstepAgent,
        CreateWorkstepCommandHandler,
        UpdateWorkstepCommandHandler,
        DeleteWorkstepCommandHandler,
        GetWorkstepByIdQueryHandler,
        GetAllWorkstepsQueryHandler,
        WorkstepStorageAgent,
        WorkstepProfile,
      ],
    })
      .overrideProvider(WorkstepStorageAgent)
      .useValue(mockDeep<WorkstepStorageAgent>())
      .compile();

    wController = app.get<WorkstepController>(WorkstepController);
    workstepStorageAgentMock = app.get(WorkstepStorageAgent);
    await app.init();
  });

  describe('getWorkstepById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(undefined);

      // Act and assert
      expect(async () => {
        await wController.getWorkstepById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workstep if proper id passed ', async () => {
      // Arrange
      const existingWorkstep = createTestWorkstep();
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
        existingWorkstep,
      );

      // Act
      const createdWorkstep = await wController.getWorkstepById(
        existingWorkstep.id,
      );

      // Assert
      expect(createdWorkstep).toMatchObject(existingWorkstep)
    });
  });

  describe('getAllWorksteps', () => {
    it('should return empty array if no worksteps', async () => {
      // Arrange
      workstepStorageAgentMock.getAllWorksteps.mockResolvedValueOnce([]);

      // Act
      const worksteps = await wController.getAllWorksteps();

      // Assert
      expect(worksteps).toHaveLength(0);
    });

    it('should return 2 worksteps if 2 exist', async () => {
      // Arrange
      const workstep1 = createTestWorkstep();
      const workstep2 = createTestWorkstep();

      workstepStorageAgentMock.getAllWorksteps.mockResolvedValueOnce([
        workstep1,
        workstep2,
      ]);

      // Act
      const worksteps = await wController.getAllWorksteps();

      // Assert
      expect(worksteps.length).toEqual(2);
      expect(worksteps[0]).toMatchObject(workstep1);
      expect(worksteps[1]).toMatchObject(workstep2);
    });
  });

  describe('createWorkstep', () => {
    it('should return new uuid from the created workstep when all necessary params provided', async () => {
      // Arrange
      const workstep = createTestWorkstep();
      workstepStorageAgentMock.createNewWorkstep.mockResolvedValueOnce(
        workstep,
      );
      const requestDto = {
        name: workstep.name,
        version: workstep.version,
        status: workstep.status,
        privacyPolicy: workstep.privacyPolicy,
        securityPolicy: workstep.securityPolicy,
        workgroupId: workstep.workgroupId,
      } as CreateWorkstepDto;
      // Act
      const response = await wController.createWorkstep(requestDto);

      // Assert
      expect(response).toEqual(workstep.id);
      expect(uuidValidate(response));
      expect(uuidVersion(response)).toEqual(4);
    });
  });

  describe('updateWorkstep', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto: UpdateWorkstepDto = {
        name: 'name',
        version: 'version',
        status: 'status',
        workgroupId: 'wgid',
        securityPolicy: 'secPolicy',
        privacyPolicy: 'privPolicy',
      };
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(undefined);

      // Act and assert
      expect(async () => {
        await wController.updateWorkstep(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const existingWorkstep = createTestWorkstep();
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
        existingWorkstep,
      );

      const updateRequestDto: UpdateWorkstepDto = {
        name: 'name2',
        version: 'version2',
        status: 'status2',
        workgroupId: 'wgid2',
        securityPolicy: 'secPolicy2',
        privacyPolicy: 'privPolicy2',
      };
      workstepStorageAgentMock.updateWorkstep.mockResolvedValueOnce({
        ...existingWorkstep,
        name: updateRequestDto.name,
        version: updateRequestDto.version,
        status: updateRequestDto.status,
        workgroupId: updateRequestDto.workgroupId,
        securityPolicy: updateRequestDto.securityPolicy,
        privacyPolicy: updateRequestDto.privacyPolicy,
      } as Workstep);

      // Act
      const updatedWorkstep = await wController.updateWorkstep(
        existingWorkstep.id,
        updateRequestDto,
      );

      // Assert
      expect(updatedWorkstep.id).toEqual(existingWorkstep.id);
      expect(updatedWorkstep.name).toEqual(updateRequestDto.name);
      expect(updatedWorkstep.version).toEqual(updateRequestDto.version);
      expect(updatedWorkstep.status).toEqual(updateRequestDto.status);
      expect(updatedWorkstep.workgroupId).toEqual(updateRequestDto.workgroupId);
      expect(updatedWorkstep.securityPolicy).toEqual(
        updateRequestDto.securityPolicy,
      );
      expect(updatedWorkstep.privacyPolicy).toEqual(
        updateRequestDto.privacyPolicy,
      );
    });
  });

  describe('deleteWorkstep', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(undefined);

      // Act and assert
      expect(async () => {
        await wController.deleteWorkstep(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const existingWorkstep = createTestWorkstep();
      workstepStorageAgentMock.getWorkstepById.mockResolvedValueOnce(
        existingWorkstep,
      );

      // Act
      await wController.deleteWorkstep(existingWorkstep.id);
    });
  });
});
