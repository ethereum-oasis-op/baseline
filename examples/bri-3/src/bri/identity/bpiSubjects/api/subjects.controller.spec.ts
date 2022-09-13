import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BpiSubjectAgent } from '../agents/bpiSubjects.agent';
import { CreateBpiSubjectCommandHandler } from '../capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { BpiSubjectRepository } from '../persistence/bpiSubjects.repository';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';
import { SubjectController } from './subjects.controller';

describe('SubjectController', () => {
  let sController: SubjectController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [SubjectController],
      // TODO: Repository mock for unit tests
      providers: [BpiSubjectAgent, CreateBpiSubjectCommandHandler, BpiSubjectRepository],
    }).compile();

    sController = app.get<SubjectController>(SubjectController);

    await app.init();
  });

  describe('Bpi Subject creation', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = { desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;

      // Act and assert
      expect(async () => {
        await sController.CreateBpiSubject(requestDto);
      }).rejects.toThrow(new BadRequestException("Name cannot be empty."));
    });

    it('should return true if all input params provided', async () => {
      // Arrange
      const requestDto = { name: "name", desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;

      // Act
      var response = await sController.CreateBpiSubject(requestDto);

      // Assert
      expect(response).toEqual(true);
    });
  });
});
