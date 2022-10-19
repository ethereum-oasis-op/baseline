import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkgroupAgent } from '../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../agents/workgroupStorage.agent';
import { CreateWorkgroupCommandHandler } from '../capabilities/createWorkgroup/createWorkgroupCommand.handler';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { WorkgroupController } from './workgroups.controller';

describe('WorkgroupController', () => {
  let wController: WorkgroupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkgroupController],
      // TODO Repository mock for unit tests
      providers: [
        WorkgroupAgent,
        CreateWorkgroupCommandHandler,
        WorkgroupStorageAgent,
      ],
    }).compile();

    wController = app.get<WorkgroupController>(WorkgroupController);

    await app.init();
  });

  describe('Workgroup creation', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = {
        administrator: 'administrator',
        securityPolicy: 'securityPolicy',
        privacyPolicy: 'privacyPolicy',
        participants: 'participants',
        worksteps: 'worksteps',
        workflows: 'workflows',
      } as unknown as CreateWorkgroupDto;

      // Act and assert
      expect(async () => {
        await wController.CreateWorkgroup(requestDto);
      }).rejects.toThrow(new BadRequestException('Name cannot be empty.'));
    });

    it('should return true if all input params provided', async () => {
      // Arrange
      const requestDto = {
        name: 'name',
        administrator: 'administrator',
        securityPolicy: 'securityPolicy',
        privacyPolicy: 'privacyPolicy',
        participants: 'participants',
        worksteps: 'worksteps',
        workflows: 'workflows',
      } as unknown as CreateWorkgroupDto;

      // Act
      const response = await wController.CreateWorkgroup(requestDto);

      // Assert
      expect(response).toEqual(true);
    });
  });
});
