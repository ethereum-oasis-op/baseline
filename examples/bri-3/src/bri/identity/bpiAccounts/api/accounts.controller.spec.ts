import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { NOT_FOUND_ERR_MESSAGE as SUBJECT_ACCOUNT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjectAccounts/api/err.messages';
import { AccountController } from './accounts.controller';
import Mapper from '../../../utils/mapper';
import { BpiAccountStorageAgent } from '../agents/bpiAccountsStorage.agent';
import { BpiAccountAgent } from '../agents/bpiAccounts.agent';
import { MockBpiAccountsStorageAgent } from '../agents/mockBpiAccountStorage.agent';
import { SubjectModule } from '../../bpiSubjects/subjects.module';
import { CreateBpiAccountCommandHandler } from '../capabilities/createBpiAccount/createBpiAccountCommand.handler';
import { DeleteBpiAccountCommandHandler } from '../capabilities/deleteBpiAccount/deleteBpiAccountCommand.handler';
import { GetAllBpiAccountsQueryHandler } from '../capabilities/getAllBpiAccounts/getAllBpiAccountQuery.handler';
import { GetBpiAccountByIdQueryHandler } from '../capabilities/getBpiAccountById/getBpiAccountByIdQuery.handler';
import { UpdateBpiAccountCommandHandler } from '../capabilities/updateBpiAccount/updateBpiAccountCommand.handler';
import { BpiSubjectAccountAgent } from '../../bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { MockBpiSubjectAccountsStorageAgent } from '../../bpiSubjectAccounts/agents/mockBpiSubjectAccountsStorage.agent';
import { CreateBpiAccountDto } from './dtos/request/createBpiAccount.dto';
import { MockBpiSubjectStorageAgent } from '../../bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { SubjectController } from '../../bpiSubjects/api/subjects.controller';
import { SubjectAccountController } from '../../bpiSubjectAccounts/api/subjectAccounts.controller';
import { CreateBpiSubjectDto } from '../../bpiSubjects/api/dtos/request/createBpiSubject.dto';
import { CreateBpiSubjectAccountDto } from '../../bpiSubjectAccounts/api/dtos/request/createBpiSubjectAccount.dto';
import { SubjectAccountModule } from '../../bpiSubjectAccounts/subjectAccounts.module';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

describe.only('AccountController', () => {
  let accountController: AccountController;
  let subjectController: SubjectController;
  let subjectAccountController: SubjectAccountController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, SubjectModule, SubjectAccountModule],
      controllers: [
        AccountController,
        SubjectController,
        SubjectAccountController,
      ],
      providers: [
        CreateBpiAccountCommandHandler,
        UpdateBpiAccountCommandHandler,
        DeleteBpiAccountCommandHandler,
        GetBpiAccountByIdQueryHandler,
        GetAllBpiAccountsQueryHandler,
        BpiAccountAgent,
        BpiAccountStorageAgent,
        BpiSubjectAccountAgent,
        BpiSubjectAccountStorageAgent,
      ],
    })
      .overrideProvider(BpiAccountStorageAgent)
      .useValue(new MockBpiAccountsStorageAgent(new Mapper()))
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(new MockBpiSubjectAccountsStorageAgent(new Mapper()))
      .compile();

    accountController = app.get<AccountController>(AccountController);
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

    const ownerBpiSubject = await subjectController.createBpiSubject(
      ownerBpiSubjectDto,
    );
    const creatorBpiSubject = await subjectController.createBpiSubject(
      creatorBpiSubjectDto,
    );

    const subjectAccountDto = {
      creatorBpiSubjectId: creatorBpiSubject,
      ownerBpiSubjectId: ownerBpiSubject,
    } as CreateBpiSubjectAccountDto;

    return subjectAccountController.createBpiSubjectAccount(subjectAccountDto);
  };

  const createBpiAccount = async (ownerBpiSubjectAccountsIds: string[]) => {
    const requestDto = {
      ownerBpiSubjectAccountsIds,
    } as CreateBpiAccountDto;

    return accountController.createBpiAccount(requestDto);
  };

  describe('getBpiAccountById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await accountController.getBpiAccountById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct bpi account if proper id passed ', async () => {
      // Arrange
      const bpiSubjectAccountId = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccountId]);

      // Act
      const createdBpiAccount = await accountController.getBpiAccountById(
        newBpiAccountId,
      );

      // Assert
      expect(createdBpiAccount.id).toEqual(newBpiAccountId);
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(createdBpiAccount.nonce).toEqual(0);
      expect(createdBpiAccount.ownerBpiSubjectAccounts.length).toEqual(1);
      const ownerBpiSubjectAccount =
        createdBpiAccount.ownerBpiSubjectAccounts[0];
      expect(ownerBpiSubjectAccount.id).toEqual(bpiSubjectAccountId);
    });
  });

  describe('getAllBpiAccounts', () => {
    it('should return empty array if no bpi accounts ', async () => {
      // Arrange and act
      const bpiAccounts = await accountController.getAllBpiAccounts();

      // Assert
      expect(bpiAccounts.length).toEqual(0);
    });

    it('should return 2 bpi accounts if 2 exists ', async () => {
      // Arrange
      const bpiSubjectAccountId = await createBpiSubjectAccount();
      const firstBpiAccountId = await createBpiAccount([bpiSubjectAccountId]);
      const secondBpiAccountId = await createBpiAccount([bpiSubjectAccountId]);

      // Act
      const bpiAccounts = await accountController.getAllBpiAccounts();

      // Assert
      expect(bpiAccounts.length).toEqual(2);
      expect(bpiAccounts[0].id).toEqual(firstBpiAccountId);
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiAccounts[0].nonce).toEqual(0);
      expect(bpiAccounts[0].ownerBpiSubjectAccounts.length).toEqual(1);
      const firstOwnerBpiSubjectAccount =
        bpiAccounts[0].ownerBpiSubjectAccounts[0];
      expect(firstOwnerBpiSubjectAccount.id).toEqual(bpiSubjectAccountId);

      expect(bpiAccounts[1].id).toEqual(secondBpiAccountId);
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiAccounts[1].nonce).toEqual(0);
      expect(bpiAccounts[1].ownerBpiSubjectAccounts.length).toEqual(1);
      const secondOwnerBpiSubjectAccount =
        bpiAccounts[0].ownerBpiSubjectAccounts[0];
      expect(secondOwnerBpiSubjectAccount.id).toEqual(bpiSubjectAccountId);
    });
  });

  describe('createBpiAccount', () => {
    it('should throw BadRequest if non existent owner provided', async () => {
      // Arrange
      const requestDto = {
        ownerBpiSubjectAccountsIds: ['123'],
      } as CreateBpiAccountDto;

      // Act and assert
      expect(async () => {
        await accountController.createBpiAccount(requestDto);
      }).rejects.toThrow(
        new BadRequestException(SUBJECT_ACCOUNT_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should return new uuid from the created bpi account when all params provided', async () => {
      // Arrange and act
      const bpiSubjectAccountId = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccountId]);

      // Assert
      expect(uuidValidate(newBpiAccountId));
      expect(uuidVersion(newBpiAccountId)).toEqual(4);
    });
  });

  describe('deleteBpiAccount', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await accountController.deleteBpiAccount(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const bpiSubjectAccountId = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccountId]);

      // Act
      await accountController.deleteBpiAccount(newBpiAccountId);

      // Assert
      expect(async () => {
        await accountController.getBpiAccountById(newBpiAccountId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
