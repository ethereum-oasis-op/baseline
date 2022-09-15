import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BpiSubjectAgent } from '../agents/bpiSubjects.agent';
import { CreateBpiSubjectCommandHandler } from '../capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { GetBpiSubjectByIdQueryHandler } from '../capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { BpiSubjectRepository } from '../persistence/bpiSubjects.repository';
import { MockBpiSubjectRepository } from '../persistence/mockBpiSubject.repository';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';
import { SubjectController } from './subjects.controller';

describe('SubjectController', () => {
  let sController: SubjectController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [SubjectController],
      providers: [
        BpiSubjectAgent,
        CreateBpiSubjectCommandHandler,
        GetBpiSubjectByIdQueryHandler,
        BpiSubjectRepository,
      ],
    })
      .overrideProvider(BpiSubjectRepository)
      .useValue(new MockBpiSubjectRepository())
      .compile();

    sController = app.get<SubjectController>(SubjectController);

    await app.init();
  });

  describe('createBpiSubject', () => {
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = {
        desc: 'desc',
        publicKey: 'publicKey',
      } as CreateBpiSubjectDto;

      // Act and assert
      expect(async () => {
        await sController.createBpiSubject(requestDto);
      }).rejects.toThrow(new BadRequestException('Name cannot be empty.'));
    });

    it('should return new uuid from the created bpi subject when all params provided', async () => {
      // Arrange
      const requestDto = {
        name: 'name',
        desc: 'desc',
        publicKey: 'publicKey',
      } as CreateBpiSubjectDto;

      // Act
      const response = await sController.createBpiSubject(requestDto);

      // Assert
      expect(response.length).toEqual(36);
    });
  });

  describe('getBpiSubjectById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await sController.getBpiSubjectById(nonExistentId);
      }).rejects.toThrow(
        new NotFoundException(
          `Bpi Subject with id: ${nonExistentId} does not exist.`,
        ),
      );
    });

    it('should return the correct bpi subject if proper id passed ', async () => {
      // Arrange
      const requestDto = {
        name: 'name',
        desc: 'desc',
        publicKey: 'publicKey',
      } as CreateBpiSubjectDto;

      const newBpiSubjectId = await sController.createBpiSubject(requestDto);

      // Act
      const createdBpiSubject = await sController.getBpiSubjectById(
        newBpiSubjectId,
      );

      // Assert
      expect(createdBpiSubject.id).toEqual(newBpiSubjectId);
      expect(createdBpiSubject.name).toEqual(requestDto.name);
      expect(createdBpiSubject.desc).toEqual(requestDto.desc);
      expect(createdBpiSubject.publicKey).toEqual(requestDto.publicKey);
    });
  });
});
