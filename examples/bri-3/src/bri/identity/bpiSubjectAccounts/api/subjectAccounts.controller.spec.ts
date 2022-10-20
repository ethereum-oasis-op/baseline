import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { NOT_FOUND_ERR_MESSAGE as SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjects/api/err.messages';
import Mapper from '../../../utils/mapper';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { SubjectAccountController } from './subjectAccounts.controller';
import { SubjectModule } from '../../bpiSubjects/subjects.module';
import { SubjectController } from '../../bpiSubjects/api/subjects.controller';
import { BpiSubjectAccountAgent } from '../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../agents/bpiSubjectAccountsStorage.agent';
import { BpiAccountStorageAgent } from '../../bpiAccounts/agents/bpiAccountsStorage.agent';
import { MockBpiAccountsStorageAgent } from '../../bpiAccounts/agents/mockBpiAccountStorage.agent';
import { CreateBpiSubjectDto } from '../../bpiSubjects/api/dtos/request/createBpiSubject.dto';
import { MockBpiSubjectAccountsStorageAgent } from '../agents/mockBpiSubjectAccountsStorage.agent';
import { CreateBpiSubjectAccountCommandHandler } from '../capabilities/createBpiSubjectAccount/createBpiSubjectAccountCommand.handler';
import { DeleteBpiSubjectAccountCommandHandler } from '../capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccountCommand.handler';
import { GetAllBpiSubjectAccountsQueryHandler } from '../capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccountsQuery.handler';
import { GetBpiSubjectAccountByIdQueryHandler } from '../capabilities/getBpiSubjectAccountById/getBpiSubjectAccountByIdQuery.handler';
import { UpdateBpiSubjectAccountCommandHandler } from '../capabilities/updateBpiSubjectAccount/updateBpiSubjectAccountCommand.handler';
import { CreateBpiSubjectAccountDto } from './dtos/request/createBpiSubjectAccount.dto';

describe.only('SubjectAccountController', () => {
  let subjectAccountController: SubjectAccountController;
  let subjectController: SubjectController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, SubjectModule],
      controllers: [SubjectController, SubjectAccountController],
      providers: [
        BpiSubjectAccountAgent,
        BpiSubjectAccountStorageAgent,
        CreateBpiSubjectAccountCommandHandler,
        UpdateBpiSubjectAccountCommandHandler,
        DeleteBpiSubjectAccountCommandHandler,
        GetBpiSubjectAccountByIdQueryHandler,
        GetAllBpiSubjectAccountsQueryHandler,
      ],
    })
      .overrideProvider(BpiAccountStorageAgent)
      .useValue(new MockBpiAccountsStorageAgent(new Mapper()))
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(new MockBpiSubjectAccountsStorageAgent(new Mapper()))
      .compile();

    subjectController = app.get<SubjectController>(SubjectController);
    subjectAccountController = app.get<SubjectAccountController>(
      SubjectAccountController,
    );

    await app.init();
  });

  const createBpiSubjectAccount = async () => {
    const ownerBpiSubjectDto = {
      name: 'owner',
      desc: 'desc',
      publicKey: 'publicKey',
    } as CreateBpiSubjectDto;
    const creatorBpiSubjectDto = {
      name: 'owner',
      desc: 'desc',
      publicKey: 'publicKey',
    } as CreateBpiSubjectDto;

    const ownerBpiSubjectId = await subjectController.createBpiSubject(
      ownerBpiSubjectDto,
    );
    const creatorBpiSubjectId = await subjectController.createBpiSubject(
      creatorBpiSubjectDto,
    );

    const subjectAccountDto = {
      creatorBpiSubjectId: creatorBpiSubjectId,
      ownerBpiSubjectId: ownerBpiSubjectId,
    } as CreateBpiSubjectAccountDto;

    const bpiSubjectAccountId =
      await subjectAccountController.createBpiSubjectAccount(subjectAccountDto);
    return {
      bpiSubjectAccountId,
      ownerBpiSubjectId,
      creatorBpiSubjectId,
    };
  };

  describe('getBpiSubjectAccountById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await subjectAccountController.getBpiSubjectAccountById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct bpi subject account if proper id passed ', async () => {
      // Arrange
      const { bpiSubjectAccountId, ownerBpiSubjectId, creatorBpiSubjectId } =
        await createBpiSubjectAccount();

      // Act
      const createdBpiAccount =
        await subjectAccountController.getBpiSubjectAccountById(
          bpiSubjectAccountId,
        );

      // Assert
      expect(createdBpiAccount.id).toEqual(bpiSubjectAccountId);
      expect(createdBpiAccount.creatorBpiSubject.id).toEqual(
        creatorBpiSubjectId,
      );
      expect(createdBpiAccount.ownerBpiSubject.id).toEqual(ownerBpiSubjectId);
    });
  });

  describe('getAllBpiSubjectAccounts', () => {
    it('should return empty array if no bpi accounts ', async () => {
      // Arrange and act
      const bpiSubjectAccounts =
        await subjectAccountController.getAllBpiSubjectAccounts();

      // Assert
      expect(bpiSubjectAccounts.length).toEqual(0);
    });

    it('should return 2 bpi subject accounts if 2 exists ', async () => {
      // Arrange
      const firstSubjectAccount = await createBpiSubjectAccount();
      const seconSubjectAccount = await createBpiSubjectAccount();

      // Act
      const bpiSubjectAccounts =
        await subjectAccountController.getAllBpiSubjectAccounts();

      // Assert
      expect(bpiSubjectAccounts.length).toEqual(2);
      expect(bpiSubjectAccounts[0].id).toEqual(
        firstSubjectAccount.bpiSubjectAccountId,
      );
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiSubjectAccounts[0].nonce).toEqual(0);
      expect(bpiSubjectAccounts[0].ownerBpiSubject.id).toEqual(
        firstSubjectAccount.ownerBpiSubjectId,
      );
      expect(bpiSubjectAccounts[0].creatorBpiSubject.id).toEqual(
        firstSubjectAccount.creatorBpiSubjectId,
      );

      expect(bpiSubjectAccounts[1].id).toEqual(
        seconSubjectAccount.bpiSubjectAccountId,
      );
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiSubjectAccounts[1].nonce).toEqual(0);
      expect(bpiSubjectAccounts[1].ownerBpiSubject.id).toEqual(
        seconSubjectAccount.ownerBpiSubjectId,
      );
      expect(bpiSubjectAccounts[1].creatorBpiSubject.id).toEqual(
        seconSubjectAccount.creatorBpiSubjectId,
      );
    });
  });

  describe('createBpiSubjectAccount', () => {
    it('should throw BadRequest if non existent creator provided', async () => {
      // Arrange
      const ownerBpiSubjectDto = {
        name: 'owner',
        desc: 'desc',
        publicKey: 'publicKey',
      } as CreateBpiSubjectDto;

      const ownerBpiSubjectId = await subjectController.createBpiSubject(
        ownerBpiSubjectDto,
      );
      const creatorBpiSubjectId = '123';

      const requestDto = {
        creatorBpiSubjectId: creatorBpiSubjectId,
        ownerBpiSubjectId: ownerBpiSubjectId,
      } as CreateBpiSubjectAccountDto;

      // Act and assert
      expect(async () => {
        await subjectAccountController.createBpiSubjectAccount(requestDto);
      }).rejects.toThrow(
        new BadRequestException(SUBJECT_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should throw BadRequest if non existent owner provided', async () => {
      // Arrange
      const creatorBpiSubjectDto = {
        name: 'creator',
        desc: 'desc',
        publicKey: 'publicKey',
      } as CreateBpiSubjectDto;

      const creatorBpiSubjectId = await subjectController.createBpiSubject(
        creatorBpiSubjectDto,
      );
      const ownerBpiSubjectId = '123';

      const requestDto = {
        creatorBpiSubjectId: creatorBpiSubjectId,
        ownerBpiSubjectId: ownerBpiSubjectId,
      } as CreateBpiSubjectAccountDto;

      // Act and assert
      expect(async () => {
        await subjectAccountController.createBpiSubjectAccount(requestDto);
      }).rejects.toThrow(
        new BadRequestException(SUBJECT_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should return new uuid from the created bpi subject account when all params provided', async () => {
      // Arrange and act
      const { bpiSubjectAccountId } = await createBpiSubjectAccount();

      // Assert
      expect(uuidValidate(bpiSubjectAccountId));
      expect(uuidVersion(bpiSubjectAccountId)).toEqual(4);
    });
  });

  describe('deleteBpiSubjectAccount', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await subjectAccountController.deleteBpiSubjectAccount(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange and act
      const { bpiSubjectAccountId } = await createBpiSubjectAccount();

      // Act
      await subjectAccountController.deleteBpiSubjectAccount(
        bpiSubjectAccountId,
      );

      // Assert
      expect(async () => {
        await subjectAccountController.getBpiSubjectAccountById(
          bpiSubjectAccountId,
        );
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
