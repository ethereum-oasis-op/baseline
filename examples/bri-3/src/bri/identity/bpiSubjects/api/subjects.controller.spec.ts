import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BpiSubjectAgent } from '../agents/bpiSubjects.agent';
import { CreateBpiSubjectCommandHandler } from '../capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { GetBpiSubjectByIdQueryHandler } from '../capabilities/getBpiSubjectById/getBpiSubjectByIdQuery.handler';
import { UpdateBpiSubjectCommandHandler } from '../capabilities/updateBpiSubject/updateBpiSubjectCommand.handler';
import { BpiSubjectRepository } from '../persistence/bpiSubjects.repository';
import { MockBpiSubjectRepository } from '../persistence/mockBpiSubject.repository';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';
import { UpdateBpiSubjectDto } from './dtos/request/updateBpiSubject.dto';
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
        UpdateBpiSubjectCommandHandler,
        GetBpiSubjectByIdQueryHandler,
        BpiSubjectRepository
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
      const requestDto = { desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;

      // Act and assert
      expect(async () => {
        await sController.createBpiSubject(requestDto);
      }).rejects.toThrow(new BadRequestException("Name cannot be empty."));
    });

    it('should return new uuid from the created bpi subject when all params provided', async () => {
      // Arrange
      const requestDto = { name: "name", desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;

      // Act
      const response = await sController.createBpiSubject(requestDto);

      // Assert
      expect(response.length).toEqual(36);
    });
  });

  describe('updateBpiSubject', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      const requestDto = { id: nonExistentId, name: "name", desc: "desc", publicKey: "publicKey"} as UpdateBpiSubjectDto;

      // Act and assert
      expect(async () => {
        await sController.updateBpiSubject(requestDto);
      }).rejects.toThrow(new NotFoundException(`Bpi Subject with id: ${nonExistentId} does not exist.`));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const createRequestDto = { name: "name1", desc: "desc1", publicKey: "publicKey1"} as CreateBpiSubjectDto;
      const newBpiSubjectId = await sController.createBpiSubject(createRequestDto);
      const updateRequestDto = { id: newBpiSubjectId,  name: "name2", desc: "desc2", publicKey: "publicKey2"} as UpdateBpiSubjectDto;

      // Act
      await sController.updateBpiSubject(updateRequestDto);
      
      // Assert
      const updatedBpiSubject = await sController.getBpiSubjectById(newBpiSubjectId);
      expect(updatedBpiSubject.id).toEqual(newBpiSubjectId);
      expect(updatedBpiSubject.name).toEqual(updateRequestDto.name);
      expect(updatedBpiSubject.desc).toEqual(updateRequestDto.desc);
      expect(updatedBpiSubject.publicKey).toEqual(updateRequestDto.publicKey);
    });
  });

  describe('getBpiSubjectById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await sController.getBpiSubjectById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(`Bpi Subject with id: ${nonExistentId} does not exist.`));
    });

    it('should return the correct bpi subject if proper id passed ', async () => {
      // Arrange
      const requestDto = { name: "name", desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;

      const newBpiSubjectId = await sController.createBpiSubject(requestDto);

      // Act
      const createdBpiSubject = await sController.getBpiSubjectById(newBpiSubjectId);

      // Assert
      expect(createdBpiSubject.id).toEqual(newBpiSubjectId);
      expect(createdBpiSubject.name).toEqual(requestDto.name);
      expect(createdBpiSubject.desc).toEqual(requestDto.desc);
      expect(createdBpiSubject.publicKey).toEqual(requestDto.publicKey);
    });
  });
});
