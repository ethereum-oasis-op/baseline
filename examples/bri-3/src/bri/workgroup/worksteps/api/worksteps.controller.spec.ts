import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkstepAgent } from '../agents/worksteps.agent';
import { CreateWorkstepCommandHandler } from '../capabilities/createWorkstep/createWorkstepCommand.handler';
import { GetWorkstepByIdQueryHandler } from '../capabilities/getWorkstepById/getWorkstepByIdQuery.handler';
import { MockWorkstepRepository } from '../persistence/mockWorksteps.repository';
import { WorkstepRepository } from '../persistence/worksteps.repository';
import { CreateWorkstepDto } from './dtos/request/createWorkstep.dto';
import { WorkstepController } from './worksteps.controller';

describe('WorkstepController', () => {
  let wController: WorkstepController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [WorkstepController],
      providers: [
        WorkstepAgent,
        CreateWorkstepCommandHandler,
        GetWorkstepByIdQueryHandler,
        WorkstepRepository,
      ],
    })
      .overrideProvider(WorkstepRepository)
      .useValue(new MockWorkstepRepository())
      .compile();

    wController = app.get<WorkstepController>(WorkstepController);

    await app.init();
  });

  describe('Workstep creation', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = {
        version: 'version',
        status: 'status',
        workgroupId: 'wgid',
      } as CreateWorkstepDto;

      // Act and assert
      expect(async () => {
        await wController.createWorkstep(requestDto);
      }).rejects.toThrow(new BadRequestException('Name cannot be empty.'));
    });

    it('should return new uuid from the created workstep when all params provided', async () => {
      // Arrange
      const requestDto = {
        name: 'name',
        version: 'version',
        status: 'status',
        workgroupId: 'wgid',
      } as CreateWorkstepDto;

      // Act
      const response = await wController.createWorkstep(requestDto);

      // Assert
      expect(response.length).toEqual(36);
    });

    describe('getWorkstepById', () => {
      it('should throw NotFound if non existent id passed', () => {
        // Arrange
        const nonExistentId = '123';

        // Act and assert
        expect(async () => {
          await wController.getWorkstepById(nonExistentId);
        }).rejects.toThrow(
          new NotFoundException(
            `Workstep with id: ${nonExistentId} does not exist.`,
          ),
        );
      });

      it('should return the correct workstep if proper id passed ', async () => {
        // Arrange
        const requestDto = {
          name: 'name',
          version: 'version',
          status: 'status',
          workgroupId: 'wgid',
        } as CreateWorkstepDto;

        const newWorkstepId = await wController.createWorkstep(requestDto);

        // Act
        const createdWorkstep = await wController.getWorkstepById(
          newWorkstepId,
        );

        // Assert
        expect(createdWorkstep.id).toEqual(newWorkstepId);
        expect(createdWorkstep.name).toEqual(requestDto.name);
        expect(createdWorkstep.version).toEqual(requestDto.version);
        expect(createdWorkstep.status).toEqual(requestDto.status);
        expect(createdWorkstep.workgroupId).toEqual(requestDto.workgroupId);
      });
    });
  });
});
