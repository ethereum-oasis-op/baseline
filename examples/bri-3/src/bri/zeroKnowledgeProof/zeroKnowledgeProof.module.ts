import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CCSMAnchorHashAgent } from './agents/ccsmAnchorHash.agent';
import { CCSMAnchorHashStorageAgent } from './agents/ccsmAnchorHashStorage.agent';
import { CCSMAnchorHashController } from './api/ccsmAnchorHash.controller';
import { CreateCCSMAnchorHashCommandHandler } from './capabilities/createCCSMAnchorHash/createCCSMAnchorHashCommand.handler';
import { VerifyCCSMAnchorHashCommandHandler } from './capabilities/verifyCCSMAnchorHash/verifyCCSMAnchorHashCommand.handler';

export const CommandHandlers = [
  CreateCCSMAnchorHashCommandHandler,
  VerifyCCSMAnchorHashCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CCSMAnchorHashController],
  providers: [
    ...CommandHandlers,
    CCSMAnchorHashAgent,
    CCSMAnchorHashStorageAgent,
  ],
})
export class ZeroKnowledgeProofModule {}
