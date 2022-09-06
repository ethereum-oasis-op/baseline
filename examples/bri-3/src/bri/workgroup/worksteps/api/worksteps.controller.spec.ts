import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateWorkstepDTO } from './dtos/request/createWorkstep.dto';
import { WorkstepController } from './worksteps.controller';

describe('WorkstepController', () => {
  let wController: WorkstepController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkstepController],
      providers: [WorkstepAgent, CreateWorkstepCommandHandler],
    }).compile();

    wController = app.get<WorkstepController>(WorkstepController);

    await app.init();
  });

  describe('Workstep creation', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = { id: 'id', workgroupId: 'wgId' } as CreateWorkstepDTO;

      // Act and assert
      expect(async () => {
        await wController.CreateWorkstep(requestDto);
      }).rejects.toThrow(new BadRequestException('Name cannot be empty.'));
    });

    it('should return true if all input params provided', async () => {
      // Arrange
      const requestDto = {
        name: 'name',
        id: 'id',
        workgroupId: 'wgId',
      } as CreateWorkstepDTO;

      // Act
      const response = await wController.CreateWorkstep(requestDto);

      // Assert
      expect(response).toEqual(true);
    });
  });
});
