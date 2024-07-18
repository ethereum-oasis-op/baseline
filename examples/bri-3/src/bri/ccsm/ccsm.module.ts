import { Module } from '@nestjs/common';
import { CcsmStorageAgent } from './agents/ccsmStorage.agent';
import { EthereumService } from './services/ethereum.service';

@Module({
  providers: [
    CcsmStorageAgent,
    {
      provide: 'IBlockchainService',
      useClass: EthereumService,
    },
  ],
  exports: [CcsmStorageAgent, 'IBlockchainService'],
})
export class CcsmModule {}
