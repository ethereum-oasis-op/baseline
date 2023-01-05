import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CCSMAnchorHashAgent } from './agents/ccsmAnchorHash.agent';
import { CCSMAnchorHashStorageAgent } from './agents/ccsmAnchorHashStorage.agent';
import { CCSMAnchorHashLocalStorageAgent } from './agents/ccsmAnchorHashLocalStorage.agent';
import { CCSMAnchorHashController } from './api/ccsmAnchorHash.controller';
import { CreateCCSMAnchorHashCommandHandler } from './capabilities/createCCSMAnchorHash/createCCSMAnchorHashCommand.handler';
import { VerifyCCSMAnchorHashCommandHandler } from './capabilities/verifyCCSMAnchorHash/verifyCCSMAnchorHashCommand.handler';
import { BlockchainService } from './services/blockchain/blockchain.service';
import { CCSMAnchorHashProfile } from './ccsmAnchorHash.profile';
import { DocumentProfile } from './document.profile';
import { GetDocumentByCCSMAnchorHashQueryHandler } from './capabilities/getDocumentByCCSMAnchorHash/getDocumentByCCSMAnchorHashQuery.handler';

export const CommandHandlers = [
  CreateCCSMAnchorHashCommandHandler,
  VerifyCCSMAnchorHashCommandHandler,
  GetDocumentByCCSMAnchorHashQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [CCSMAnchorHashController],
  providers: [
    ...CommandHandlers,
    CCSMAnchorHashAgent,
    CCSMAnchorHashStorageAgent,
    CCSMAnchorHashLocalStorageAgent,
    BlockchainService,
    CCSMAnchorHashProfile,
    DocumentProfile,
  ],
})
export class ZeroKnowledgeProofModule {}
