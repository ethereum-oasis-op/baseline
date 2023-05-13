import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnchorHashAgent } from './agents/anchorHash.agent';
import { AnchorHashCcsmStorageAgent } from './agents/anchorHashCcsmStorage.agent';
import { AnchorHashStorageAgent } from './agents/anchorHashStorage.agent';
import { AnchorHashController } from './api/anchorHash.controller';
import { VerifyAnchorHashCommandHandler } from './capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { BlockchainService } from './services/blockchain/blockchain.service';
import { AnchorHashProfile } from './anchorHash.profile';
import { SnarkjsCircuitService } from './services/circuit/snarkjs/snarkjs.service';

export const CommandHandlers = [VerifyAnchorHashCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [AnchorHashController],
  providers: [
    ...CommandHandlers,
    AnchorHashAgent,
    AnchorHashStorageAgent,
    AnchorHashCcsmStorageAgent,
    BlockchainService,
    AnchorHashProfile,
    {
      provide: 'ICircuitService',
      useClass: SnarkjsCircuitService,
    },
  ],
})
export class ZeroKnowledgeProofModule {}
