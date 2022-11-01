import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_PROOF_INPUT } from './err.messages';
import { ProofController } from './proof.controller';
import { ProofAgent } from '../agents/proof.agent';
import { CreateProofCommandHandler } from '../capabilities/createProof/createProofCommand.handler';
import { VerifyProofCommandHandler } from '../capabilities/verifyProof/verifyProofCommand.handler';
import { ProofStorageAgent } from '../agents/proofStorage.agent';
import { CreateProofDto } from './dtos/request/createProof.dto';
import { VerifyProofDto } from './dtos/request/verifyProof.dto';

describe('ProofController', () => {
  let controller: ProofController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [ProofController],
      providers: [
        ProofAgent,
        CreateProofCommandHandler,
        VerifyProofCommandHandler,
        ProofStorageAgent,
      ],
    }).compile();

    controller = app.get<ProofController>(ProofController);

    await app.init();
  });

  describe('createProof', () => {
    it('should throw BadRequest if document parameter is empty', async () => {
      // Arrange
      const missingDocumentParam = {
        ownerAccountId: '123',
        document: {
          documentObjectType: '',
          documentObjectInput: {},
        },
        signature: '123',
      };

      // Act and assert
      expect(async () => {
        await controller.createProof(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_PROOF_INPUT));
    });

    it('should return the correct transaction if proper document passed ', async () => {
      // Arrange
      const requestDto = {
        ownerAccountId: 'from',
        document: {
          documentObjectType: 'document',
          documentObjectInput: { input: 'document1' },
        },
        signature: 'signature',
      } as CreateProofDto;

      // Act
      const createdProof = await controller.createProof(requestDto);

      // Assert
      expect(createdProof.owner).toEqual(requestDto.ownerAccountId);
      expect(createdProof.payload).toEqual('document1'); // TODO: Add merkle root of document as payload
      expect(createdProof.signature).toEqual(requestDto.signature);
    });
  });

  describe('verifyProof', () => {
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
        await controller.verifyProof(missingDocumentParam);
      }).rejects.toThrow(new BadRequestException(INVALID_PROOF_INPUT));
    });

    it('should perform the verification if document is provided', async () => {
      // Arrange
      const verifyRequestDto = {
        document: {
          documentObjectType: 'document',
          documentObjectInput: { input: 'document1' },
        },
        signature: '123',
      } as VerifyProofDto;

      // Act
      const verification = await controller.verifyProof(verifyRequestDto);

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
