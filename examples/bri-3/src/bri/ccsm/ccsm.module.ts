import { Module } from '@nestjs/common';
import { CcsmStorageAgent } from './agents/ccsmStorage.agent';
import { EthereumService } from './services/ethereum.service';

@Module({
  providers: [
    CcsmStorageAgent,
    {
      provide: 'ICcsmService',
      useClass: EthereumService,
    },
  ],
  exports: [CcsmStorageAgent, 'ICcsmService'],
})
export class CcsmModule {}
