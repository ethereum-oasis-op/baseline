import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { NOT_FOUND_ERR_MESSAGE as SUBJECT_ACCOUNT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjectAccounts/api/err.messages';
import { AccountController } from './accounts.controller';
import { BpiAccountStorageAgent } from '../agents/bpiAccountsStorage.agent';
import { BpiAccountAgent } from '../agents/bpiAccounts.agent';
import { MockBpiAccountsStorageAgent } from '../agents/mockBpiAccountStorage.agent';
import { CreateBpiAccountCommandHandler } from '../capabilities/createBpiAccount/createBpiAccountCommand.handler';
import { DeleteBpiAccountCommandHandler } from '../capabilities/deleteBpiAccount/deleteBpiAccountCommand.handler';
import { GetAllBpiAccountsQueryHandler } from '../capabilities/getAllBpiAccounts/getAllBpiAccountQuery.handler';
import { GetBpiAccountByIdQueryHandler } from '../capabilities/getBpiAccountById/getBpiAccountByIdQuery.handler';
import { UpdateBpiAccountCommandHandler } from '../capabilities/updateBpiAccount/updateBpiAccountCommand.handler';
import { BpiSubjectAccountAgent } from '../../bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../../bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { MockBpiSubjectAccountsStorageAgent } from '../../bpiSubjectAccounts/agents/mockBpiSubjectAccountsStorage.agent';
import { CreateBpiAccountDto } from './dtos/request/createBpiAccount.dto';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { BpiSubjectStorageAgent } from '../../bpiSubjects/agents/bpiSubjectsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';
import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';
import { AccountsProfile } from '../accounts.profile';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { SubjectsProfile } from '../../bpiSubjects/subjects.profile';
import { SubjectAccountsProfile } from '../../bpiSubjectAccounts/subjectAccounts.profile';

describe('AccountController', () => {
  let accountController: AccountController;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;
  let mockBpiSubjectAccountsStorageAgent: MockBpiSubjectAccountsStorageAgent;

  beforeEach(async () => {
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();
    mockBpiSubjectAccountsStorageAgent =
      new MockBpiSubjectAccountsStorageAgent();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [AccountController],
      providers: [
        CreateBpiAccountCommandHandler,
        UpdateBpiAccountCommandHandler,
        DeleteBpiAccountCommandHandler,
        GetBpiAccountByIdQueryHandler,
        GetAllBpiAccountsQueryHandler,
        BpiAccountAgent,
        BpiAccountStorageAgent,
        BpiSubjectStorageAgent,
        BpiSubjectAccountAgent,
        BpiSubjectAccountStorageAgent,
        SubjectsProfile,
        SubjectAccountsProfile,
        AccountsProfile,
      ],
    })
      .overrideProvider(BpiAccountStorageAgent)
      .useValue(new MockBpiAccountsStorageAgent())
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(mockBpiSubjectAccountsStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    accountController = app.get<AccountController>(AccountController);

    await app.init();
  });

  const createBpiSubjectAccount = async () => {
    const ownerBpiSubject = await mockBpiSubjectStorageAgent.storeNewBpiSubject(
      new BpiSubject('123', 'owner', 'desc', 'publicKey', []),
    );
    const creatorBpiSubject =
      await mockBpiSubjectStorageAgent.storeNewBpiSubject(
        new BpiSubject('321', 'creator', 'desc', 'publicKey', []),
      );
    const bpiSubjectAccount = new BpiSubjectAccount(
      '123',
      creatorBpiSubject,
      ownerBpiSubject,
      'sample policy',
      'sample policy',
      'sample key',
      'sample vc',
    );

    return mockBpiSubjectAccountsStorageAgent.storeNewBpiSubjectAccount(
      bpiSubjectAccount,
    );
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
      const bpiSubjectAccount = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccount.id]);

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
      expect(ownerBpiSubjectAccount.id).toEqual(bpiSubjectAccount.id);

      const ownerBpiSubject = ownerBpiSubjectAccount.ownerBpiSubject;
      const creatorBpiSubject = ownerBpiSubjectAccount.creatorBpiSubject;
      expect(ownerBpiSubject.id).toEqual(bpiSubjectAccount.ownerBpiSubject.id);
      expect(creatorBpiSubject.id).toEqual(
        bpiSubjectAccount.creatorBpiSubject.id,
      );
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
      const bpiSubjectAccount = await createBpiSubjectAccount();
      const firstBpiAccountId = await createBpiAccount([bpiSubjectAccount.id]);
      const secondBpiAccountId = await createBpiAccount([bpiSubjectAccount.id]);

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
      expect(firstOwnerBpiSubjectAccount.id).toEqual(bpiSubjectAccount.id);
      expect(firstOwnerBpiSubjectAccount.creatorBpiSubject.id).toEqual(
        bpiSubjectAccount.creatorBpiSubject.id,
      );
      expect(firstOwnerBpiSubjectAccount.ownerBpiSubject.id).toEqual(
        bpiSubjectAccount.ownerBpiSubject.id,
      );

      expect(bpiAccounts[1].id).toEqual(secondBpiAccountId);
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiAccounts[1].nonce).toEqual(0);
      expect(bpiAccounts[1].ownerBpiSubjectAccounts.length).toEqual(1);
      const secondOwnerBpiSubjectAccount =
        bpiAccounts[0].ownerBpiSubjectAccounts[0];
      expect(secondOwnerBpiSubjectAccount.id).toEqual(bpiSubjectAccount.id);
      expect(secondOwnerBpiSubjectAccount.creatorBpiSubject.id).toEqual(
        bpiSubjectAccount.creatorBpiSubject.id,
      );
      expect(secondOwnerBpiSubjectAccount.ownerBpiSubject.id).toEqual(
        bpiSubjectAccount.ownerBpiSubject.id,
      );
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
      const bpiSubjectAccount = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccount.id]);

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
      const bpiSubjectAccount = await createBpiSubjectAccount();
      const newBpiAccountId = await createBpiAccount([bpiSubjectAccount.id]);

      // Act
      await accountController.deleteBpiAccount(newBpiAccountId);

      // Assert
      expect(async () => {
        await accountController.getBpiAccountById(newBpiAccountId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
