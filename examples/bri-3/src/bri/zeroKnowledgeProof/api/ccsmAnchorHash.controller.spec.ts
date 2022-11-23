import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { CcsmAnchorHashController } from './ccsmAnchorHashHash.controller';
import { CcsmAnchorHashAgent } from '../agents/ccsmAnchorHashHash.agent';
import { CreateCcsmAnchorHashCommandHandler } from '../capabilities/createCcsmAnchorHash/createCcsmAnchorHashCommand.handler';
import { VerifyCcsmAnchorHashCommandHandler } from '../capabilities/verifyCcsmAnchorHash/verifyCcsmAnchorHashCommand.handler';
import { CcsmAnchorHashStorageAgent } from '../agents/ccsmAnchorHashHashStorage.agent';
import { CreateCcsmAnchorHashDto } from './dtos/request/createCcsmAnchorHash.dto';
import { VerifyCcsmAnchorHashDto } from './dtos/request/verifyCcsmAnchorHash.dto';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../components/blockchain/blockchain.service';
import { DocumentObject } from '../models/document';

describe('ProofController', () => {
  let controller: CcsmAnchorHashController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CcsmAnchorHashController],
      providers: [
        CcsmAnchorHashAgent,
        CreateCcsmAnchorHashCommandHandler,
        VerifyCcsmAnchorHashCommandHandler,
        CcsmAnchorHashStorageAgent,
        BlockchainService,
      ],
    }).compile();

    controller = app.get<CcsmAnchorHashController>(CcsmAnchorHashController);

    await app.init();
  });

  describe('createCcsmAnchorHash', () => {
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
        await controller.createCcsmAnchorHash(missingDocumentParam);
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
      } as CreateCcsmAnchorHashDto;

      // Act
      const ccsmAnchorHash = await controller.createCcsmAnchorHash(requestDto);
      console.log(ccsmAnchorHash);

      // Assert
      expect(ccsmAnchorHash.owner).toEqual(requestDto.ownerAccount);
      expect(ccsmAnchorHash.hash).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(ccsmAnchorHash.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyCcsmAnchorHash', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockDocument = new DocumentObject('', {});

      const missingDocumentParam = {
        inputForProofVerification: mockDocument,
        signature: '123',
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyCcsmAnchorHash(missingDocumentParam);
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
      } as VerifyCcsmAnchorHashDto;

      // Act
      const verification = await controller.verifyCcsmAnchorHash(
        verifyRequestDto,
      );

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
