import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkstepAgent } from '../agents/worksteps.agent';
import { CreateWorkstepCommandHandler } from '../capabilities/createWorkstep/createWorkstepCommand.handler';
import { DeleteWorkstepCommandHandler } from '../capabilities/deleteWorkstep/deleteWorkstepCommand.handler';
import { GetAllWorkstepsQueryHandler } from '../capabilities/getAllWorksteps/getAllWorkstepsQuery.handler';
import { GetWorkstepByIdQueryHandler } from '../capabilities/getWorkstepById/getWorkstepByIdQuery.handler';
import { UpdateWorkstepCommandHandler } from '../capabilities/updateWorkstep/updateWorkstep.command.handler';
import { MockWorkstepStorageAgent } from '../persistence/mockWorkstepsStorage.agent';
import { WorkstepStorageAgent } from '../persistence/workstepsStorage.agent';
import { CreateWorkstepDto } from './dtos/request/createWorkstep.dto';
import { UpdateWorkstepDto } from './dtos/request/updateWorkstep.dto';
import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { WorkstepController } from './worksteps.controller';
import { validate as uuidValidate, version as uuidVersion } from "uuid";

describe('WorkstepController', () => {
  let wController: WorkstepController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkstepController],
      providers: [
        WorkstepAgent,
        CreateWorkstepCommandHandler,
        UpdateWorkstepCommandHandler,
        DeleteWorkstepCommandHandler,
        GetWorkstepByIdQueryHandler,
        GetAllWorkstepsQueryHandler,
        WorkstepStorageAgent,
      ],
    })
      .overrideProvider(WorkstepStorageAgent)
      .useValue(new MockWorkstepStorageAgent())
      .compile();

    wController = app.get<WorkstepController>(WorkstepController);

    await app.init();
  });

  describe('getWorkstepById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await wController.getWorkstepById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct workstep if proper id passed ', async () => {
      // Arrange
      const requestDto = { name: 'name', version: 'version', status: 'status', workgroupId: 'wgid', securityPolicy: 'secPolicy', privacyPolicy: 'privPolicy' } as CreateWorkstepDto;

      const newWorkstepId = await wController.createWorkstep(requestDto);

      // Act
      const createdWorkstep = await wController.getWorkstepById(newWorkstepId);

      // Assert
      expect(createdWorkstep.id).toEqual(newWorkstepId);
      expect(createdWorkstep.name).toEqual(requestDto.name);
      expect(createdWorkstep.version).toEqual(requestDto.version);
      expect(createdWorkstep.status).toEqual(requestDto.status);
      expect(createdWorkstep.workgroupId).toEqual(requestDto.workgroupId);
      expect(createdWorkstep.securityPolicy).toEqual(requestDto.securityPolicy);
      expect(createdWorkstep.privacyPolicy).toEqual(requestDto.privacyPolicy);
    });
  });

  describe('getAllWorksteps', () => {
    it('should return empty array if no worksteps', async () => {
      // Act
      const worksteps = await wController.getAllWorksteps();

      // Assert
      expect(worksteps.length).toEqual(0);
    });

    it('should return 2 worksteps if 2 exist', async () => {
      // Arrange
      const requestDto1 = { name: 'name1', version: 'version1', status: 'status1', workgroupId: 'wgid1', securityPolicy: 'secPolicy', privacyPolicy: 'privPolicy' } as CreateWorkstepDto;
      const newWorkstepId1 = await wController.createWorkstep(requestDto1);

      const requestDto2 = { name: 'name2', version: 'version2', status: 'status2', workgroupId: 'wgid2', securityPolicy: 'secPolicy', privacyPolicy: 'privPolicy' } as CreateWorkstepDto;
      const newWorkstepId2 = await wController.createWorkstep(requestDto2);

      // Act
      const worksteps = await wController.getAllWorksteps();

      // Assert
      expect(worksteps.length).toEqual(2);
      expect(worksteps[0].id).toEqual(newWorkstepId1);
      expect(worksteps[0].name).toEqual(requestDto1.name);
      expect(worksteps[0].version).toEqual(requestDto1.version);
      expect(worksteps[0].status).toEqual(requestDto1.status);
      expect(worksteps[0].workgroupId).toEqual(requestDto1.workgroupId);
      expect(worksteps[0].securityPolicy).toEqual(requestDto1.securityPolicy);
      expect(worksteps[0].privacyPolicy).toEqual(requestDto1.privacyPolicy);
      expect(worksteps[1].id).toEqual(newWorkstepId2);
      expect(worksteps[1].name).toEqual(requestDto2.name);
      expect(worksteps[1].version).toEqual(requestDto2.version);
      expect(worksteps[1].status).toEqual(requestDto2.status);
      expect(worksteps[1].workgroupId).toEqual(requestDto2.workgroupId);
      expect(worksteps[1].securityPolicy).toEqual(requestDto1.securityPolicy);
      expect(worksteps[1].privacyPolicy).toEqual(requestDto1.privacyPolicy);
    });
  });

  describe('createWorkstep', () => {
    it('should return new uuid from the created workstep when all necessary params provided', async () => {

      let worksteps = await wController.getAllWorksteps();
      expect(worksteps).toEqual([]);

      // Arrange
      const requestDto = { name: 'name', version: 'version', status: 'status', workgroupId: 'wgid', securityPolicy: 'secPolicy', privacyPolicy: 'privPolicy' } as CreateWorkstepDto;

      // Act
      const response = await wController.createWorkstep(requestDto);
      worksteps = await wController.getAllWorksteps();
      
      // Assert
      expect(worksteps).toHaveLength(1);
      expect(uuidValidate(response));
      expect(uuidVersion(response)).toEqual(4);
    });
  });

  describe('updateWorkstep', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto = { name: 'name', version: 'version', status: 'status', workgroupId: 'wgid', securityPolicy: 'secPolicy', privacyPolicy: 'privPolicy' } as UpdateWorkstepDto;

      // Act and assert
      expect(async () => {
        await wController.updateWorkstep(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const createRequestDto = { name: 'name1', version: 'version1', status: 'status1', workgroupId: 'wgid1', securityPolicy: 'secPolicy1', privacyPolicy: 'privPolicy1' } as CreateWorkstepDto;
      const newWorkstepId = await wController.createWorkstep(createRequestDto);
      const updateRequestDto = { name: 'name2', version: 'version2', status: 'status2', workgroupId: 'wgid2', securityPolicy: 'secPolicy2', privacyPolicy: 'privPolicy2' } as UpdateWorkstepDto;

      // Act
      await wController.updateWorkstep(newWorkstepId, updateRequestDto);
      
      // Assert
      const updatedWorkstep = await wController.getWorkstepById(newWorkstepId);
      expect(updatedWorkstep.id).toEqual(newWorkstepId);
      expect(updatedWorkstep.name).toEqual(updateRequestDto.name);
      expect(updatedWorkstep.version).toEqual(updateRequestDto.version);
      expect(updatedWorkstep.status).toEqual(updateRequestDto.status);
      expect(updatedWorkstep.workgroupId).toEqual(updateRequestDto.workgroupId);
      expect(updatedWorkstep.securityPolicy).toEqual(updateRequestDto.securityPolicy);
      expect(updatedWorkstep.privacyPolicy).toEqual(updateRequestDto.privacyPolicy);
    });
  });

  describe('deleteWorkstep', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await wController.deleteWorkstep(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const createRequestDto = { name: 'name1', version: 'version1', status: 'status1', workgroupId: 'wgid1', securityPolicy: 'secPolicy1', privacyPolicy: 'privPolicy1'} as CreateWorkstepDto;
      const newWorkstepId = await wController.createWorkstep(createRequestDto);

      // Act
      await wController.deleteWorkstep(newWorkstepId);
      
      // Assert
      expect(async () => {
        await wController.getWorkstepById(newWorkstepId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
