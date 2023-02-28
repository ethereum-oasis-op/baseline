import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
import { NOT_FOUND_ERR_MESSAGE as SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjects/api/err.messages';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { SubjectAccountController } from './subjectAccounts.controller';
import { BpiSubjectAccountAgent } from '../agents/bpiSubjectAccounts.agent';
import { BpiSubjectAccountStorageAgent } from '../agents/bpiSubjectAccountsStorage.agent';
import { MockBpiSubjectAccountsStorageAgent } from '../agents/mockBpiSubjectAccountsStorage.agent';
import { CreateBpiSubjectAccountCommandHandler } from '../capabilities/createBpiSubjectAccount/createBpiSubjectAccountCommand.handler';
import { DeleteBpiSubjectAccountCommandHandler } from '../capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccountCommand.handler';
import { GetAllBpiSubjectAccountsQueryHandler } from '../capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccountsQuery.handler';
import { GetBpiSubjectAccountByIdQueryHandler } from '../capabilities/getBpiSubjectAccountById/getBpiSubjectAccountByIdQuery.handler';
import { UpdateBpiSubjectAccountCommandHandler } from '../capabilities/updateBpiSubjectAccount/updateBpiSubjectAccountCommand.handler';
import { CreateBpiSubjectAccountDto } from './dtos/request/createBpiSubjectAccount.dto';
import { BpiSubjectStorageAgent } from '../../bpiSubjects/agents/bpiSubjectsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';
import { SubjectAccountsProfile } from '../subjectAccounts.profile';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { SubjectsProfile } from '../../bpiSubjects/subjects.profile';
import { TEST_VALUES } from 'src/bri/shared/constants';

describe('SubjectAccountController', () => {
  let subjectAccountController: SubjectAccountController;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;

  beforeEach(async () => {
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [SubjectAccountController],
      providers: [
        BpiSubjectAccountAgent,
        BpiSubjectAccountStorageAgent,
        BpiSubjectStorageAgent,
        CreateBpiSubjectAccountCommandHandler,
        UpdateBpiSubjectAccountCommandHandler,
        DeleteBpiSubjectAccountCommandHandler,
        GetBpiSubjectAccountByIdQueryHandler,
        GetAllBpiSubjectAccountsQueryHandler,
        SubjectsProfile,
        SubjectAccountsProfile,
      ],
    })
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(new MockBpiSubjectAccountsStorageAgent())
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    subjectAccountController = app.get<SubjectAccountController>(
      SubjectAccountController,
    );

    await app.init();
  });

  const createBpiSubjectAccount = async () => {
    const ownerBpiSubject =
      await mockBpiSubjectStorageAgent.createNewBpiSubject(
        new BpiSubject(
          TEST_VALUES.ownerId,
          TEST_VALUES.ownerName,
          TEST_VALUES.description,
          BpiSubjectType.External,
          TEST_VALUES.publicKey,
        ),
      );
    const creatorBpiSubject =
      await mockBpiSubjectStorageAgent.createNewBpiSubject(
        new BpiSubject(
          TEST_VALUES.creatorId,
          TEST_VALUES.creatorName,
          TEST_VALUES.description,
          BpiSubjectType.External,
          TEST_VALUES.publicKey,
        ),
      );

    const subjectAccountDto = {
      creatorBpiSubjectId: creatorBpiSubject.id,
      ownerBpiSubjectId: ownerBpiSubject.id,
      authenticationPoliy: 'sample',
      authorizationPolicy: 'sample',
      verifiableCredential: 'sample',
      recoveryKey: 'sample',
    } as CreateBpiSubjectAccountDto;

    const bpiSubjectAccountId =
      await subjectAccountController.createBpiSubjectAccount(subjectAccountDto);
    return {
      bpiSubjectAccountId,
      ownerBpiSubject,
      creatorBpiSubject,
    };
  };

  describe('getBpiSubjectAccountById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = TEST_VALUES.id;

      // Act and assert
      expect(async () => {
        await subjectAccountController.getBpiSubjectAccountById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct bpi subject account if proper id passed ', async () => {
      // Arrange
      const { bpiSubjectAccountId, ownerBpiSubject, creatorBpiSubject } =
        await createBpiSubjectAccount();

      // Act
      const createdBpiAccount =
        await subjectAccountController.getBpiSubjectAccountById(
          bpiSubjectAccountId,
        );

      // Assert
      expect(createdBpiAccount.id).toEqual(bpiSubjectAccountId);
      expect(createdBpiAccount.creatorBpiSubject.id).toEqual(
        creatorBpiSubject.id,
      );
      expect(createdBpiAccount.ownerBpiSubject.id).toEqual(ownerBpiSubject.id);
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
        firstSubjectAccount.ownerBpiSubject.id,
      );
      expect(bpiSubjectAccounts[0].creatorBpiSubject.id).toEqual(
        firstSubjectAccount.creatorBpiSubject.id,
      );

      expect(bpiSubjectAccounts[1].id).toEqual(
        seconSubjectAccount.bpiSubjectAccountId,
      );
      // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
      // expect(bpiSubjectAccounts[1].nonce).toEqual(0);
      expect(bpiSubjectAccounts[1].ownerBpiSubject.id).toEqual(
        seconSubjectAccount.ownerBpiSubject.id,
      );
      expect(bpiSubjectAccounts[1].creatorBpiSubject.id).toEqual(
        seconSubjectAccount.creatorBpiSubject.id,
      );
    });
  });

  describe('createBpiSubjectAccount', () => {
    it('should throw BadRequest if non existent creator provided', async () => {
      // Arrange
      const ownerBpiSubject =
        await mockBpiSubjectStorageAgent.createNewBpiSubject(
          new BpiSubject(
            TEST_VALUES.id,
            TEST_VALUES.ownerName,
            TEST_VALUES.description,
            BpiSubjectType.External,
            TEST_VALUES.publicKey,
          ),
        );
      const creatorBpiSubjectId = 'not-existing-id';

      const requestDto = {
        creatorBpiSubjectId: creatorBpiSubjectId,
        ownerBpiSubjectId: ownerBpiSubject.id,
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
      const creatorBpiSubject =
        await mockBpiSubjectStorageAgent.createNewBpiSubject(
          new BpiSubject(
            TEST_VALUES.creatorId,
            TEST_VALUES.creatorName,
            TEST_VALUES.description,
            BpiSubjectType.External,
            TEST_VALUES.publicKey,
          ),
        );
      const ownerBpiSubjectId = 'not-existing-id';

      //Sample data provided
      const requestDto = {
        creatorBpiSubjectId: creatorBpiSubject.id,
        ownerBpiSubjectId: ownerBpiSubjectId,
        authenticationPoliy: 'sample',
        authorizationPolicy: 'sample',
        verifiableCredential: 'sample',
        recoveryKey: 'sample',
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
      const nonExistentId = TEST_VALUES.id;
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
