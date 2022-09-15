import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BpiSubjectAgent } from '../agents/bpiSubjects.agent';
import { CreateBpiSubjectCommandHandler } from '../capabilities/createBpiSubject/createBpiSubjectCommand.handler';
import { DeleteBpiSubjectCommandHandler } from '../capabilities/deleteBpiSubject/updateBpiSubjectCommand.handler';
import { GetAllBpiSubjectsQueryHandler } from '../capabilities/getAllBpiSubjects/getAllBpiSubjectsQuery.handler';
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
        DeleteBpiSubjectCommandHandler,
        GetBpiSubjectByIdQueryHandler,
        GetAllBpiSubjectsQueryHandler,
        BpiSubjectRepository
      ],
    })
    .overrideProvider(BpiSubjectRepository)
    .useValue(new MockBpiSubjectRepository())
    .compile();

    sController = app.get<SubjectController>(SubjectController);

    await app.init();
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

  describe('getAllBpiSubjects', () => {
    it('should return emtpy array if not bpi subjects ', async () => {
      // Act
      const bpiSubjects = await sController.getAllBpiSubjects();

      // Assert
      expect(bpiSubjects.length).toEqual(0);
    });

    it('should return 2 bpi subjects if 2 exists ', async () => {
      // Arrange
      const requestDto1 = { name: "name1", desc: "desc1", publicKey: "publicKey1"} as CreateBpiSubjectDto;
      const newBpiSubjectId1 = await sController.createBpiSubject(requestDto1);

      const requestDto2 = { name: "name2", desc: "desc2", publicKey: "publicKey2"} as CreateBpiSubjectDto;
      const newBpiSubjectId2 = await sController.createBpiSubject(requestDto2);

      // Act
      const bpiSubjects = await sController.getAllBpiSubjects();

      // Assert
      expect(bpiSubjects.length).toEqual(2);
      expect(bpiSubjects[0].id).toEqual(newBpiSubjectId1);
      expect(bpiSubjects[0].name).toEqual(requestDto1.name);
      expect(bpiSubjects[0].desc).toEqual(requestDto1.desc);
      expect(bpiSubjects[0].publicKey).toEqual(requestDto1.publicKey);
      expect(bpiSubjects[1].id).toEqual(newBpiSubjectId2);
      expect(bpiSubjects[1].name).toEqual(requestDto2.name);
      expect(bpiSubjects[1].desc).toEqual(requestDto2.desc);
      expect(bpiSubjects[1].publicKey).toEqual(requestDto2.publicKey);
    });
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
      const requestDto = { name: "name", desc: "desc", publicKey: "publicKey"} as UpdateBpiSubjectDto;

      // Act and assert
      expect(async () => {
        await sController.updateBpiSubject(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(`Bpi Subject with id: ${nonExistentId} does not exist.`));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const createRequestDto = { name: "name1", desc: "desc1", publicKey: "publicKey1"} as CreateBpiSubjectDto;
      const newBpiSubjectId = await sController.createBpiSubject(createRequestDto);
      const updateRequestDto = { name: "name2", desc: "desc2", publicKey: "publicKey2"} as UpdateBpiSubjectDto;

      // Act
      await sController.updateBpiSubject(newBpiSubjectId, updateRequestDto);
      
      // Assert
      const updatedBpiSubject = await sController.getBpiSubjectById(newBpiSubjectId);
      expect(updatedBpiSubject.id).toEqual(newBpiSubjectId);
      expect(updatedBpiSubject.name).toEqual(updateRequestDto.name);
      expect(updatedBpiSubject.desc).toEqual(updateRequestDto.desc);
      expect(updatedBpiSubject.publicKey).toEqual(updateRequestDto.publicKey);
    });
  });

  describe('deleteBpiSubject', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await sController.deleteBpiSubject(nonExistentId);
      }).rejects.toThrow(new NotFoundException(`Bpi Subject with id: ${nonExistentId} does not exist.`));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const createRequestDto = { name: "name1", desc: "desc1", publicKey: "publicKey1"} as CreateBpiSubjectDto;
      const newBpiSubjectId = await sController.createBpiSubject(createRequestDto);

      // Act
      await sController.deleteBpiSubject(newBpiSubjectId);
      
      // Assert
      expect(async () => {
        await sController.getBpiSubjectById(newBpiSubjectId);
      }).rejects.toThrow(new NotFoundException(`Bpi Subject with id: ${newBpiSubjectId} does not exist.`));
    });
  });
});
