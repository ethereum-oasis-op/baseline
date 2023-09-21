import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { AnchorHashController } from './anchorHash.controller';
import { AnchorHashAgent } from '../agents/anchorHash.agent';
import { VerifyAnchorHashCommandHandler } from '../capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { AutomapperModule } from '@automapper/nestjs';
import { VerifyAnchorHashDto } from './dtos/request/verifyAnchorHash.dto';
import { BlockchainService } from '../services/blockchain/blockchain.interface';
import { AnchorHashProfile } from '../anchorHash.profile';
import { classes } from '@automapper/classes';
import { AnchorHashCcsmStorageAgent } from '../agents/ccsmStorage.agent';

describe('ProofController', () => {
  let controller: AnchorHashController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [AnchorHashController],
      providers: [
        AnchorHashAgent,
        VerifyAnchorHashCommandHandler,
        AnchorHashCcsmStorageAgent,
        BlockchainService,
        AnchorHashProfile,
      ],
    }).compile();

    controller = app.get<AnchorHashController>(AnchorHashController);

    await app.init();
  });

  describe('verifyAnchorHash', () => {
    it('should throw BadRequest if inputForProofVerification parameter is missing', async () => {
      // Arrange
      const mockState = '';

      const missingStateParam = {
        inputForProofVerification: mockState,
      };

      // Act and assert
      await expect(async () => {
        await controller.verifyAnchorHash(missingStateParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should perform the verification if state is provided', async () => {
      // Arrange
      const mockState = 'This is test state';

      const verifyRequestDto = {
        inputForProofVerification: mockState,
      } as VerifyAnchorHashDto;

      // Act
      const verification = await controller.verifyAnchorHash(verifyRequestDto);

      // Assert
      expect(verification).toEqual(true);
    });
  });
});
