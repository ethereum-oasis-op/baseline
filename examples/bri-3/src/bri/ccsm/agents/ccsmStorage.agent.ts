import { Inject, Injectable } from '@nestjs/common';
import { ICcsmService } from '../services/ccsm.interface';

@Injectable()
export class CcsmStorageAgent {
  constructor(
    @Inject('IBlockchainService')
    private readonly ccsmService: ICcsmService,
  ) {}

  async storeAnchorHashOnCcsm(anchorHash: string): Promise<void> {
    await this.ccsmService.storeAnchorHash('Ccsm', anchorHash);
  }
}
