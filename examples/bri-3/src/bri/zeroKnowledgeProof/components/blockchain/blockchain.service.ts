import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BlockchainService implements OnModuleInit {
  async onModuleInit() {
    // TODO: connect to blockchain
  }

  async deploy(contract: any) {
    //TODO: deploy contract
  }

  async store(anchorHash: string) {
    //TODO: store content-addressable hash on contract
  }

  async get(publicInputForProofVerification: string): Promise<string> {
    //TODO: returns the content-addressable hash if it exists on contract
    return publicInputForProofVerification;
  }
}
