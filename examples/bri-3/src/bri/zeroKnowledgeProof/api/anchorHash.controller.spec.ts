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
      ],
    }).compile();

    controller = app.get<AnchorHashController>(AnchorHashController);

    await app.init();
  });

  describe('createAnchorHash', () => {
    it('should throw BadRequest if document parameter is empty', async () => {
      // Arrange
      const missingDocumentParam = {
        ownerAccountId: {},
        document: {
          documentObjectType: '',
          documentObjectInput: {},
        },
        signature: '123',
      };

      // Act and assert
      expect(async () => {
        await controller.createAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should return the correct transaction if proper document passed ', async () => {
      // Arrange
      const requestDto = {
        ownerAccountId: {},
        document: {
          documentObjectType: 'document',
          documentObjectInput: { input: 'document1' },
        },
        signature: 'signature',
      } as CreateAnchorHashDto;

      // Act
      const anchorHash = await controller.createAnchorHash(requestDto);

      // Assert
      expect(anchorHash.owner).toEqual(requestDto.ownerAccountId);
      expect(anchorHash.hash).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(anchorHash.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyAnchorHash', () => {
    it('should throw BadRequest if document parameter is missing', async () => {
      // Arrange
      const missingDocumentParam = {
        document: {
          documentObjectType: '',
          documentObjectInput: {},
        },
        signature: '123',
      };

      // Act and assert
      expect(async () => {
        await controller.verifyAnchorHash(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should perform the verification if document is provided', async () => {
      // Arrange
      const verifyRequestDto = {
        document: {
          documentObjectType: 'document',
          documentObjectInput: { input: 'document1' },
        },
        signature: '123',
      } as VerifyAnchorHashDto;

      // Act
      const verification = await controller.verifyAnchorHash(verifyRequestDto);

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
