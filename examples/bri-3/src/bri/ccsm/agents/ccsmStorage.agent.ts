import { Inject, Injectable } from '@nestjs/common';
import { ICcsmService } from '../services/ccsm.interface';

@Injectable()
export class CcsmStorageAgent {
  constructor(
    @Inject('ICcsmService')
    private readonly ccsmService: ICcsmService,
  ) {}

  async storeAnchorHashOnCcsm(workstepInstanceId: string, anchorHash: string): Promise<void> {
    await this.ccsmService.storeAnchorHash(workstepInstanceId, anchorHash);
  }
}
