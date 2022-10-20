// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { CqrsModule } from '@nestjs/cqrs';
// import { Test, TestingModule } from '@nestjs/testing';

// import { NOT_FOUND_ERR_MESSAGE } from './err.messages';
// import { NOT_FOUND_ERR_MESSAGE as SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjects/api/err.messages';
// import Mapper from '../../../utils/mapper';
// import { validate as uuidValidate, version as uuidVersion } from 'uuid';
// import { SubjectAccountController } from './subjectAccounts.controller';
// import { BpiSubjectAccountAgent } from '../agents/bpiSubjectAccounts.agent';
// import { BpiSubjectAccountStorageAgent } from '../agents/bpiSubjectAccountsStorage.agent';
// import { MockBpiSubjectAccountsStorageAgent } from '../agents/mockBpiSubjectAccountsStorage.agent';
// import { CreateBpiSubjectAccountCommandHandler } from '../capabilities/createBpiSubjectAccount/createBpiSubjectAccountCommand.handler';
// import { DeleteBpiSubjectAccountCommandHandler } from '../capabilities/deleteBpiSubjectAccount/deleteBpiSubjectAccountCommand.handler';
// import { GetAllBpiSubjectAccountsQueryHandler } from '../capabilities/getAllBpiSubjectAccounts/getAllBpiSubjectAccountsQuery.handler';
// import { GetBpiSubjectAccountByIdQueryHandler } from '../capabilities/getBpiSubjectAccountById/getBpiSubjectAccountByIdQuery.handler';
// import { UpdateBpiSubjectAccountCommandHandler } from '../capabilities/updateBpiSubjectAccount/updateBpiSubjectAccountCommand.handler';
// import { CreateBpiSubjectAccountDto } from './dtos/request/createBpiSubjectAccount.dto';
// import { BpiSubjectStorageAgent } from '../../bpiSubjects/agents/bpiSubjectsStorage.agent';
// import { MockBpiSubjectStorageAgent } from '../../bpiSubjects/agents/mockBpiSubjectStorage.agent';
// import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';
// import { BpiSubjectType } from '../../bpiSubjects/models/bpiSubjectType.enum';

// describe('SubjectAccountController', () => {
//   let subjectAccountController: SubjectAccountController;
//   let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;

//   beforeEach(async () => {
//     mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent(new Mapper());

//     const app: TestingModule = await Test.createTestingModule({
//       imports: [CqrsModule],
//       controllers: [SubjectAccountController],
//       providers: [
//         BpiSubjectAccountAgent,
//         BpiSubjectAccountStorageAgent,
//         BpiSubjectStorageAgent,
//         CreateBpiSubjectAccountCommandHandler,
//         UpdateBpiSubjectAccountCommandHandler,
//         DeleteBpiSubjectAccountCommandHandler,
//         GetBpiSubjectAccountByIdQueryHandler,
//         GetAllBpiSubjectAccountsQueryHandler,
//       ],
//     })
//       .overrideProvider(BpiSubjectAccountStorageAgent)
//       .useValue(new MockBpiSubjectAccountsStorageAgent(new Mapper()))
//       .overrideProvider(BpiSubjectStorageAgent)
//       .useValue(mockBpiSubjectStorageAgent)
//       .compile();

//     subjectAccountController = app.get<SubjectAccountController>(
//       SubjectAccountController,
//     );

//     await app.init();
//   });

//   const createBpiSubjectAccount = async () => {
//     const ownerBpiSubject =
//       await mockBpiSubjectStorageAgent.createNewBpiSubject(
//         new BpiSubject(
//           '123',
//           'owner',
//           'desc',
//           BpiSubjectType.External,
//           'publicKey',
//         ),
//       );
//     const creatorBpiSubject =
//       await mockBpiSubjectStorageAgent.createNewBpiSubject(
//         new BpiSubject(
//           '321',
//           'creator',
//           'desc',
//           BpiSubjectType.External,
//           'publicKey',
//         ),
//       );

//     const subjectAccountDto = {
//       creatorBpiSubjectId: creatorBpiSubject.id,
//       ownerBpiSubjectId: ownerBpiSubject.id,
//     } as CreateBpiSubjectAccountDto;

//     const bpiSubjectAccountId =
//       await subjectAccountController.createBpiSubjectAccount(subjectAccountDto);
//     return {
//       bpiSubjectAccountId,
//       ownerBpiSubject,
//       creatorBpiSubject,
//     };
//   };

//   describe('getBpiSubjectAccountById', () => {
//     it('should throw NotFound if non existent id passed', () => {
//       // Arrange
//       const nonExistentId = '123';

//       // Act and assert
//       expect(async () => {
//         await subjectAccountController.getBpiSubjectAccountById(nonExistentId);
//       }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
//     });

//     it('should return the correct bpi subject account if proper id passed ', async () => {
//       // Arrange
//       const { bpiSubjectAccountId, ownerBpiSubject, creatorBpiSubject } =
//         await createBpiSubjectAccount();

//       // Act
//       const createdBpiAccount =
//         await subjectAccountController.getBpiSubjectAccountById(
//           bpiSubjectAccountId,
//         );

//       // Assert
//       expect(createdBpiAccount.id).toEqual(bpiSubjectAccountId);
//       expect(createdBpiAccount.creatorBpiSubject.id).toEqual(
//         creatorBpiSubject.id,
//       );
//       expect(createdBpiAccount.ownerBpiSubject.id).toEqual(ownerBpiSubject.id);
//     });
//   });

//   describe('getAllBpiSubjectAccounts', () => {
//     it('should return empty array if no bpi accounts ', async () => {
//       // Arrange and act
//       const bpiSubjectAccounts =
//         await subjectAccountController.getAllBpiSubjectAccounts();

//       // Assert
//       expect(bpiSubjectAccounts.length).toEqual(0);
//     });

//     it('should return 2 bpi subject accounts if 2 exists ', async () => {
//       // Arrange
//       const firstSubjectAccount = await createBpiSubjectAccount();
//       const seconSubjectAccount = await createBpiSubjectAccount();

//       // Act
//       const bpiSubjectAccounts =
//         await subjectAccountController.getAllBpiSubjectAccounts();

//       // Assert
//       expect(bpiSubjectAccounts.length).toEqual(2);
//       expect(bpiSubjectAccounts[0].id).toEqual(
//         firstSubjectAccount.bpiSubjectAccountId,
//       );
//       // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
//       // expect(bpiSubjectAccounts[0].nonce).toEqual(0);
//       expect(bpiSubjectAccounts[0].ownerBpiSubject.id).toEqual(
//         firstSubjectAccount.ownerBpiSubject.id,
//       );
//       expect(bpiSubjectAccounts[0].creatorBpiSubject.id).toEqual(
//         firstSubjectAccount.creatorBpiSubject.id,
//       );

//       expect(bpiSubjectAccounts[1].id).toEqual(
//         seconSubjectAccount.bpiSubjectAccountId,
//       );
//       // TODO fix when automapper is introduced, currently all fields that are not in constructor seems to be ignored
//       // expect(bpiSubjectAccounts[1].nonce).toEqual(0);
//       expect(bpiSubjectAccounts[1].ownerBpiSubject.id).toEqual(
//         seconSubjectAccount.ownerBpiSubject.id,
//       );
//       expect(bpiSubjectAccounts[1].creatorBpiSubject.id).toEqual(
//         seconSubjectAccount.creatorBpiSubject.id,
//       );
//     });
//   });

//   describe('createBpiSubjectAccount', () => {
//     it('should throw BadRequest if non existent creator provided', async () => {
//       // Arrange
//       const ownerBpiSubject =
//         await mockBpiSubjectStorageAgent.createNewBpiSubject(
//           new BpiSubject(
//             '123',
//             'owner',
//             'desc',
//             BpiSubjectType.External,
//             'publicKey',
//           ),
//         );
//       const creatorBpiSubjectId = 'not-existing-id';

//       const requestDto = {
//         creatorBpiSubjectId: creatorBpiSubjectId,
//         ownerBpiSubjectId: ownerBpiSubject.id,
//       } as CreateBpiSubjectAccountDto;

//       // Act and assert
//       expect(async () => {
//         await subjectAccountController.createBpiSubjectAccount(requestDto);
//       }).rejects.toThrow(
//         new BadRequestException(SUBJECT_NOT_FOUND_ERR_MESSAGE),
//       );
//     });

//     it('should throw BadRequest if non existent owner provided', async () => {
//       // Arrange
//       const creatorBpiSubject =
//         await mockBpiSubjectStorageAgent.createNewBpiSubject(
//           new BpiSubject(
//             '123',
//             'creator',
//             'desc',
//             BpiSubjectType.External,
//             'publicKey',
//           ),
//         );
//       const ownerBpiSubjectId = 'not-existing-id';

//       const requestDto = {
//         creatorBpiSubjectId: creatorBpiSubject.id,
//         ownerBpiSubjectId: ownerBpiSubjectId,
//       } as CreateBpiSubjectAccountDto;

//       // Act and assert
//       expect(async () => {
//         await subjectAccountController.createBpiSubjectAccount(requestDto);
//       }).rejects.toThrow(
//         new BadRequestException(SUBJECT_NOT_FOUND_ERR_MESSAGE),
//       );
//     });

//     it('should return new uuid from the created bpi subject account when all params provided', async () => {
//       // Arrange and act
//       const { bpiSubjectAccountId } = await createBpiSubjectAccount();

//       // Assert
//       expect(uuidValidate(bpiSubjectAccountId));
//       expect(uuidVersion(bpiSubjectAccountId)).toEqual(4);
//     });
//   });

//   describe('deleteBpiSubjectAccount', () => {
//     it('should throw NotFound if non existent id passed', () => {
//       // Arrange
//       const nonExistentId = '123';
//       // Act and assert
//       expect(async () => {
//         await subjectAccountController.deleteBpiSubjectAccount(nonExistentId);
//       }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
//     });

//     it('should perform the delete if existing id passed', async () => {
//       // Arrange and act
//       const { bpiSubjectAccountId } = await createBpiSubjectAccount();

//       // Act
//       await subjectAccountController.deleteBpiSubjectAccount(
//         bpiSubjectAccountId,
//       );

//       // Assert
//       expect(async () => {
//         await subjectAccountController.getBpiSubjectAccountById(
//           bpiSubjectAccountId,
//         );
//       }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
//     });
//   });
// });
