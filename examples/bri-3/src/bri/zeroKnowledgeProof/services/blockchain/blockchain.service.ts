import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  async write(ccsmAnchorHash: string) {
    //TODO: store content-addressable hash on contract
  }

  async read(publicInputForProofVerification: string): Promise<string> {
    //TODO: returns the content-addressable hash if it exists on contract
    return publicInputForProofVerification;
  }
}
