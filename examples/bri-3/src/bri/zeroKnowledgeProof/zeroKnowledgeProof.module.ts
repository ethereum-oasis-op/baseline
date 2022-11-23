import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CcsmAnchorHashAgent } from './agents/ccsmAnchorHash.agent';
import { CcsmAnchorHashStorageAgent } from './agents/ccsmAnchorHashStorage.agent';
import { CcsmAnchorHashController } from './api/ccsmAnchorHash.controller';
import { CreateCcsmAnchorHashCommandHandler } from './capabilities/createCcsmAnchorHash/createCcsmAnchorHashCommand.handler';
import { VerifyCcsmAnchorHashCommandHandler } from './capabilities/verifyCcsmAnchorHash/verifyCcsmAnchorHashCommand.handler';

export const CommandHandlers = [
  CreateCcsmAnchorHashCommandHandler,
  VerifyCcsmAnchorHashCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CcsmAnchorHashController],
  providers: [
    ...CommandHandlers,
    CcsmAnchorHashAgent,
    CcsmAnchorHashStorageAgent,
  ],
})
export class ZeroKnowledgeProofModule {}
