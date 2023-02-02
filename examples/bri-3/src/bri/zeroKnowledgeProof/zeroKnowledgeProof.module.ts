import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnchorHashAgent } from './agents/anchorHash.agent';
import { AnchorHashCCSMStorageAgent } from './agents/anchorHashCCSMStorage.agent';
import { AnchorHashStorageAgent } from './agents/anchorHashStorage.agent';
import { AnchorHashController } from './api/anchorHash.controller';
import { CreateAnchorHashCommandHandler } from './capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from './capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { BlockchainService } from './services/blockchain/blockchain.service';
import { AnchorHashProfile } from './anchorHash.profile';
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
