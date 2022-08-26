import { Test, TestingModule } from '@nestjs/testing';
import { SubjectController } from './subjects.controller';
import { BpiSubjectAgent } from '../agents/bpiSubjects.agent';
import { BadRequestException } from '@nestjs/common';
import { CreateBpiSubjectDto } from './dtos/request/createBpiSubject.dto';

describe('SubjectController', () => {
  let sController: SubjectController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubjectController],
      providers: [BpiSubjectAgent],
    }).compile();

    sController = app.get<SubjectController>(SubjectController);
  });

  describe('root', () => {
    it('should throw BadRequest if name not provided', () => {
      const requestDto = { desc: "desc", publicKey: "publicKey"} as CreateBpiSubjectDto;
      expect(sController.CreateBpiSubject(requestDto)).toThrow(BadRequestException);
    });
  });
});
