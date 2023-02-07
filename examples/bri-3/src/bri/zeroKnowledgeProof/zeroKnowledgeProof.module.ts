import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnchorHashAgent } from './agents/anchorHash.agent';
import { AnchorHashCcsmStorageAgent } from './agents/anchorHashCcsmStorage.agent';
import { AnchorHashStorageAgent } from './agents/anchorHashStorage.agent';
import { AnchorHashController } from './api/anchorHash.controller';
import { CreateAnchorHashCommandHandler } from './capabilities/createAnchorHash/createAnchorHashCommand.handler';
import { VerifyAnchorHashCommandHandler } from './capabilities/verifyAnchorHash/verifyAnchorHashCommand.handler';
import { BlockchainService } from './services/blockchain/blockchain.service';
<<<<<<< HEAD
import { CCSMAnchorHashProfile } from './ccsmAnchorHash.profile';
import { DocumentProfile } from './document.profile';
import { GetDocumentByCCSMAnchorHashQueryHandler } from './capabilities/getDocumentByCCSMAnchorHash/getDocumentByCCSMAnchorHashQuery.handler';
=======
import { AnchorHashProfile } from './anchorHash.profile';
>>>>>>> dcace9af79f4e81b8c11472bf870f23e6d9d9f0b

export const CommandHandlers = [
  CreateAnchorHashCommandHandler,
  VerifyAnchorHashCommandHandler,
];

export const QueryHandlers = [GetDocumentByCCSMAnchorHashQueryHandler];
@Module({
  imports: [CqrsModule],
  controllers: [AnchorHashController],
  providers: [
    ...CommandHandlers,
<<<<<<< HEAD
    ...QueryHandlers,
    CCSMAnchorHashAgent,
    CCSMAnchorHashStorageAgent,
    CCSMAnchorHashLocalStorageAgent,
=======
    AnchorHashAgent,
    AnchorHashStorageAgent,
    AnchorHashCcsmStorageAgent,
>>>>>>> dcace9af79f4e81b8c11472bf870f23e6d9d9f0b
    BlockchainService,
    AnchorHashProfile,
  ],
})
export class ZeroKnowledgeProofModule {}
