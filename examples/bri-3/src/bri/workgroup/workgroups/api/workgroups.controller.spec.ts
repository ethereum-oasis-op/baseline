import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkgroupAgent } from '../agents/workgroups.agent';
import { CreateWorkgroupDto } from './dtos/request/createWorkgroup.dto';
import { WorkgroupController } from './workgroups.controller';

describe('WorkgroupController', () => {
  let wController: WorkgroupController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkgroupController],
      providers: [WorkgroupAgent, CreateWorkgroupCommandHandler],
    }).compile();

    wController = app.get<WorkgroupController>(WorkgroupController);

    await app.init();
  });

  describe('Bpi Workgroup creation', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = {
        administrator: 'A',
        participants: 'P',
        worksteps: 'W',
        workflows: 'W',
      } as unknown as CreateWorkgroupDto;

      // Act and assert
      expect(async () => {
        await wController.CreateWorkgroup(requestDto);
      }).rejects.toThrow(new BadRequestException('Name cannot be empty.'));
    });

    it('should return true if all input params provided', async () => {
      // Arrange
      const requestDto = {
        administrator: 'A',
        participants: 'P',
        worksteps: 'W',
        workflows: 'W',
      } as unknown as CreateWorkgroupDto;

      // Act
      const response = await wController.CreateWorkgroup(requestDto);

      // Assert
      expect(response).toEqual(true);
    });
  });
});
