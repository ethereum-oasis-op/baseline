import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CCSMAnchorAgent } from './agents/ccsmAnchor.agent';
import { CCSMAnchorStorageAgent } from './agents/ccsmAnchorStorage.agent';
import { CCSMAnchorController } from './api/ccsmAnchor.controller';
import { CreateCCSMAnchorCommandHandler } from './capabilities/createCCSMAnchor/createCCSMAnchorCommand.handler';
import { VerifyCCSMAnchorCommandHandler } from './capabilities/verifyCCSMAnchor/verifyCCSMAnchorCommand.handler';

export const CommandHandlers = [
  CreateCCSMAnchorCommandHandler,
  VerifyCCSMAnchorCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CCSMAnchorController],
  providers: [...CommandHandlers, CCSMAnchorAgent, CCSMAnchorStorageAgent],
})
export class ZeroKnowledgeProofModule {}
