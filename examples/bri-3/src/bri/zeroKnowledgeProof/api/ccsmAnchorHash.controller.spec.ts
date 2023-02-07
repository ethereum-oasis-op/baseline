import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { CCSMAnchorHashController } from './ccsmAnchorHash.controller';
import { CCSMAnchorHashAgent } from '../agents/ccsmAnchorHash.agent';
import { CreateCCSMAnchorHashCommandHandler } from '../capabilities/createCCSMAnchorHash/createCCSMAnchorHashCommand.handler';
import { VerifyCCSMAnchorHashCommandHandler } from '../capabilities/verifyCCSMAnchorHash/verifyCCSMAnchorHashCommand.handler';
import { CCSMAnchorHashStorageAgent } from '../agents/ccsmAnchorHashStorage.agent';
import { CreateCCSMAnchorHashDto } from './dtos/request/createCCSMAnchorHash.dto';
import { VerifyCCSMAnchorHashDto } from './dtos/request/verifyCCSMAnchorHash.dto';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../services/blockchain/blockchain.service';

describe('ProofController', () => {
  let controller: CCSMAnchorHashController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CCSMAnchorHashController],
      providers: [
        CCSMAnchorHashAgent,
        CreateCCSMAnchorHashCommandHandler,
        VerifyCCSMAnchorHashCommandHandler,
        CCSMAnchorHashStorageAgent,
        BlockchainService,
      ],
    }).compile();

    controller = app.get<CCSMAnchorHashController>(CCSMAnchorHashController);

    await app.init();
  });

  describe('createCCSMAnchorHash', () => {
    it('should throw BadRequest if document parameter is empty', async () => {
      // Arrange
      const mockBpiSubject = new BpiSubject('123', '123', '123', '123', []);

      const mockBpiSubjectAccount = new BpiSubjectAccount(
        '123',
        mockBpiSubject,
        mockBpiSubject,
        'sample policy',
        'sample policy',
        'sample key',
        'sample vc',
      );

      const mockDocument = '';

      const missingDocumentParam = {
        ownerAccount: mockBpiSubjectAccount,
        document: mockDocument,
      };

      // Act and assert
      await expect(async () => {
        await controller.createCCSMAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should return the correct transaction if proper document passed ', async () => {
      // Arrange
      const mockBpiSubject = new BpiSubject('123', '123', '123', '123', []);

      const mockBpiSubjectAccount = new BpiSubjectAccount(
        '123',
        mockBpiSubject,
        mockBpiSubject,
        'sample policy',
        'sample policy',
        'sample key',
        'sample vc',
      );

      const mockDocument = 'This is test document';

      const requestDto = {
        ownerAccount: mockBpiSubjectAccount,
        document: mockDocument,
      } as CreateCCSMAnchorHashDto;

      // Act
      const ccsmAnchorHash = await controller.createCCSMAnchorHash(requestDto);

      // Assert
      expect(ccsmAnchorHash.ownerId).toEqual(requestDto.ownerAccount.id);
      expect(ccsmAnchorHash.hash).toEqual('This is test document'); // TODO: Add merkle root of document as payload
    });
  });

  describe('verifyCCSMAnchorHash', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockDocument = '';

      const missingDocumentParam = {
        inputForProofVerification: mockDocument,
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyCCSMAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should perform the verification if document is provided', async () => {
      // Arrange
      const mockDocument = 'This is test document';

      const verifyRequestDto = {
        inputForProofVerification: mockDocument,
      } as VerifyCCSMAnchorHashDto;

      // Act
      const verification = await controller.verifyCCSMAnchorHash(
        verifyRequestDto,
      );

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
