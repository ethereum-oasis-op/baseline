import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnchorHashAgent } from './agents/anchorHash.agent';
import { AnchorHashStorageAgent } from './agents/anchorHashStorage.agent';
import { AnchorHashController } from './api/anchorHash.controller';
import { CreateAnchorHashCommandHandler } from './capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from './capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';

export const CommandHandlers = [
  CreateAnchorHashCommandHandler,
  VerifyAnchorHashCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [AnchorHashController],
  providers: [...CommandHandlers, AnchorHashAgent, AnchorHashStorageAgent],
})
export class ZeroKnowledgeProofModule {}
