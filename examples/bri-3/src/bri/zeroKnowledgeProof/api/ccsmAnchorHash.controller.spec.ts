import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { CCSMAnchorHashController } from './ccsmAnchorHashHash.controller';
import { CCSMAnchorHashAgent } from '../agents/ccsmAnchorHashHash.agent';
import { CreateCCSMAnchorHashCommandHandler } from '../capabilities/createCCSMAnchorHash/createCCSMAnchorHashCommand.handler';
import { VerifyCCSMAnchorHashCommandHandler } from '../capabilities/verifyCCSMAnchorHash/verifyCCSMAnchorHashCommand.handler';
import { CCSMAnchorHashStorageAgent } from '../agents/ccsmAnchorHashHashStorage.agent';
import { CreateCCSMAnchorHashDto } from './dtos/request/createCCSMAnchorHash.dto';
import { VerifyCCSMAnchorHashDto } from './dtos/request/verifyCCSMAnchorHash.dto';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../components/blockchain/blockchain.service';
import { DocumentObject } from '../models/document';

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
      const mockBpiSubject = new BpiSubject(
        '123',
        '123',
        '123',
        BpiSubjectType.External,
        '123',
      );

      const mockBpiSubjectAccount = new BpiSubjectAccount(
        '123',
        mockBpiSubject,
        mockBpiSubject,
      );

      const mockBpiAccount = new BpiAccount('123', []);

      const mockDocument = new DocumentObject('', {});

      const missingDocumentParam = {
        ownerAccount: mockBpiSubjectAccount,
        agreementState: mockBpiAccount,
        document: mockDocument,
        signature: '123',
      };

      // Act and assert
      await expect(async () => {
        await controller.createCCSMAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should return the correct transaction if proper document passed ', async () => {
      // Arrange
      const mockBpiSubject = new BpiSubject(
        '123',
        '123',
        '123',
        BpiSubjectType.External,
        '123',
      );

      const mockBpiSubjectAccount = new BpiSubjectAccount(
        '123',
        mockBpiSubject,
        mockBpiSubject,
      );

      const mockBpiAccount = new BpiAccount('123', []);

      const mockDocument = new DocumentObject('document', {
        input: 'document1',
      });

      const requestDto = {
        ownerAccount: mockBpiSubjectAccount,
        agreementState: mockBpiAccount,
        document: mockDocument,
        signature: 'signature',
      } as CreateCCSMAnchorHashDto;

      // Act
      const ccsmAnchorHash = await controller.createCCSMAnchorHash(requestDto);
      console.log(ccsmAnchorHash);

      // Assert
      expect(ccsmAnchorHash.owner).toEqual(requestDto.ownerAccount);
      expect(ccsmAnchorHash.hash).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(ccsmAnchorHash.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyCCSMAnchorHash', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockDocument = new DocumentObject('', {});

      const missingDocumentParam = {
        inputForProofVerification: mockDocument,
        signature: '123',
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyCCSMAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should perform the verification if document is provided', async () => {
      // Arrange
      const mockDocument = new DocumentObject('document', {
        input: 'document1',
      });

      const verifyRequestDto = {
        inputForProofVerification: mockDocument,
        signature: '123',
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
