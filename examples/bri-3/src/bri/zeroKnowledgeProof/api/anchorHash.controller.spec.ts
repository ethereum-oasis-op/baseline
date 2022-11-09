import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { AnchorHashController } from './anchorHash.controller';
import { AnchorHashAgent } from '../agents/anchorHash.agent';
import { CreateAnchorHashCommandHandler } from '../capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from '../capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { AnchorHashStorageAgent } from '../agents/anchorHashStorage.agent';
import { CreateAnchorHashDto } from './dtos/request/createAnchorHash.dto';
import { VerifyAnchorHashDto } from './dtos/request/verifyAnchorHash.dto';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../components/blockchain/blockchain.service';
import { DocumentObject } from '../models/document';

describe('ProofController', () => {
  let controller: AnchorHashController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AnchorHashController],
      providers: [
        AnchorHashAgent,
        CreateAnchorHashCommandHandler,
        VerifyAnchorHashCommandHandler,
        AnchorHashStorageAgent,
        BlockchainService,
      ],
    }).compile();

    controller = app.get<AnchorHashController>(AnchorHashController);

    await app.init();
  });

  describe('createAnchorHash', () => {
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
        await controller.createAnchorHash(missingDocumentParam);
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
      } as CreateAnchorHashDto;

      // Act
      const anchorHash = await controller.createAnchorHash(requestDto);
      console.log(anchorHash);

      // Assert
      expect(anchorHash.owner).toEqual(requestDto.ownerAccount);
      expect(anchorHash.hash).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(anchorHash.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyAnchorHash', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockDocument = new DocumentObject('', {});

      const missingDocumentParam = {
        inputForProofVerification: mockDocument,
        signature: '123',
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyAnchorHash(missingDocumentParam);
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
      } as VerifyAnchorHashDto;

      // Act
      const verification = await controller.verifyAnchorHash(verifyRequestDto);

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
