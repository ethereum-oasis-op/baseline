import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnchorHashAgent } from './agents/AnchorHash.agent';
import { AnchorHashCCSMStorageAgent } from './agents/AnchorHashCCSMStorage.agent';
import { AnchorHashStorageAgent } from './agents/AnchorHashStorage.agent';
import { AnchorHashController } from './api/anchorHash.controller';
import { CreateAnchorHashCommandHandler } from './capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from './capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { BlockchainService } from './services/blockchain/blockchain.service';
import { AnchorHashProfile } from './AnchorHash.profile';
import { StateProfile } from './state.profile';

export const CommandHandlers = [
  CreateAnchorHashCommandHandler,
  VerifyAnchorHashCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [AnchorHashController],
  providers: [
    ...CommandHandlers,
    AnchorHashAgent,
    AnchorHashStorageAgent,
    AnchorHashCCSMStorageAgent,
    BlockchainService,
    AnchorHashProfile,
    StateProfile,
  ],
})
export class ZeroKnowledgeProofModule {}
