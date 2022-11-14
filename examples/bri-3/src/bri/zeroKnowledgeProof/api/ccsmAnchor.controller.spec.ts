import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { CCSMAnchorController } from './ccsmAnchor.controller';
import { CCSMAnchorAgent } from '../agents/ccsmAnchor.agent';
import { CreateCCSMAnchorCommandHandler } from '../capabilities/createCCSMAnchor/createCCSMAnchorCommand.handler';
import { VerifyCCSMAnchorCommandHandler } from '../capabilities/verifyCCSMAnchor/verifyCCSMAnchorCommand.handler';
import { CCSMAnchorStorageAgent } from '../agents/ccsmAnchorStorage.agent';
import { CreateCCSMAnchorDto } from './dtos/request/createCCSMAnchor.dto';
import { VerifyCCSMAnchorDto } from './dtos/request/verifyCCSMAnchor.dto';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../components/blockchain/blockchain.service';
import { DocumentObject } from '../models/document';

describe('ProofController', () => {
  let controller: CCSMAnchorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CCSMAnchorController],
      providers: [
        CCSMAnchorAgent,
        CreateCCSMAnchorCommandHandler,
        VerifyCCSMAnchorCommandHandler,
        CCSMAnchorStorageAgent,
        BlockchainService,
      ],
    }).compile();

    controller = app.get<CCSMAnchorController>(CCSMAnchorController);

    await app.init();
  });

  describe('createCCSMAnchor', () => {
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
        await controller.createCCSMAnchor(missingDocumentParam);
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
      } as CreateCCSMAnchorDto;

      // Act
      const ccsmAnchor = await controller.createCCSMAnchor(requestDto);
      console.log(ccsmAnchor);

      // Assert
      expect(ccsmAnchor.owner).toEqual(requestDto.ownerAccount);
      expect(ccsmAnchor.hash).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(ccsmAnchor.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyCCSMAnchor', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockDocument = new DocumentObject('', {});

      const missingDocumentParam = {
        inputForProofVerification: mockDocument,
        signature: '123',
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyCCSMAnchor(missingDocumentParam);
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
      } as VerifyCCSMAnchorDto;

      // Act
      const verification = await controller.verifyCCSMAnchor(verifyRequestDto);

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
