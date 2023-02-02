import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { INVALID_ANCHOR_HASH_INPUT } from './err.messages';
import { AnchorHashController } from './anchorHash.controller';
import { AnchorHashAgent } from '../agents/AnchorHash.agent';
import { CreateAnchorHashCommandHandler } from '../capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from '../capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { AnchorHashStorageAgent } from '../agents/AnchorHashStorage.agent';
import { MockAnchorHashLocalStorageAgent } from '../agents/mockAnchorHashLocalStorage.agent';
import { AutomapperModule } from '@automapper/nestjs';
import { CreateAnchorHashDto } from './dtos/request/createAnchorHash.dto';
import { VerifyAnchorHashDto } from './dtos/request/verifyAnchorHash.dto';
import { BpiSubjectType } from '../../identity/bpiSubjects/models/bpiSubjectType.enum';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BlockchainService } from '../services/blockchain/blockchain.service';
import { AnchorHashLocalStorageAgent } from '../agents/AnchorHashLocalStorage.agent';
import { AnchorHashProfile } from '../AnchorHash.profile';
import { StateProfile } from '../state.profile';
import { classes } from '@automapper/classes';
import { MockBpiSubjectAccountsStorageAgent } from '../../identity/bpiSubjectAccounts/agents/mockBpiSubjectAccountsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { BpiSubjectAccountStorageAgent } from '../../identity/bpiSubjectAccounts/agents/bpiSubjectAccountsStorage.agent';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';

describe('ProofController', () => {
  let controller: AnchorHashController;
  let mockBpiSubjectAccountsStorageAgent: MockBpiSubjectAccountsStorageAgent;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;

  beforeEach(async () => {
    mockBpiSubjectAccountsStorageAgent =
      new MockBpiSubjectAccountsStorageAgent();
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();
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
        CreateAnchorHashCommandHandler,
        VerifyAnchorHashCommandHandler,
        AnchorHashStorageAgent,
        AnchorHashLocalStorageAgent,
        BlockchainService,
        AnchorHashProfile,
        StateProfile,
      ],
    })
      .overrideProvider(AnchorHashLocalStorageAgent)
      .useValue(new MockAnchorHashLocalStorageAgent())
      .overrideProvider(BpiSubjectAccountStorageAgent)
      .useValue(mockBpiSubjectAccountsStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    controller = app.get<AnchorHashController>(AnchorHashController);

    await app.init();
  });

  describe('createAnchorHash', () => {
    it('should throw BadRequest if state parameter is empty', async () => {
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

      const mockState = '';

      const missingStateParam = {
        ownerAccount: mockBpiSubjectAccount,
        state: mockState,
      };

      // Act and assert
      await expect(async () => {
        await controller.createAnchorHash(missingStateParam);
      }).rejects.toThrow(new BadRequestException(INVALID_ANCHOR_HASH_INPUT));
    });

    it('should return the correct transaction if proper state passed ', async () => {
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

      const mockState = 'This is test state';

      const requestDto = {
        ownerAccount: mockBpiSubjectAccount,
        state: mockState,
      } as CreateAnchorHashDto;

      // Act
      const AnchorHash = await controller.createAnchorHash(requestDto);
      const expectedHash = crypto
        .createHash('sha256')
        .update(mockState)
        .digest('base64');

      // Assert
      expect(AnchorHash.ownerBpiSubjectId).toEqual(requestDto.ownerAccount.id);
      expect(AnchorHash.hash).toEqual(expectedHash);
    });
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
