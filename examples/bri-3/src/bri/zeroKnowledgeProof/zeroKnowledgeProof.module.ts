import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CcsmStorageAgent } from './agents/ccsmStorage.agent';
import { SnarkjsCircuitService } from './services/circuit/snarkjs/snarkjs.service';
import { EthereumService } from './services/blockchain/ethereum/ethereum.service';

@Module({
  imports: [CqrsModule],

  providers: [
    CcsmStorageAgent,
    {
      provide: 'ICircuitService',
      useClass: SnarkjsCircuitService,
    },
    {
      provide: 'IBlockchainService',
      useClass: EthereumService,
    },
  ],
  exports: ['ICircuitService', 'IBlockchainService', CcsmStorageAgent],
})
export class ZeroKnowledgeProofModule {}
