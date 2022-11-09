import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BlockchainService implements OnModuleInit {
  async onModuleInit() {
    // TODO: connect to blockchain
  }

  async deploy(contract: any) {
    //TODO: deploy contract
  }

  async store(proof: string) {
    //TODO: store content-addressable hash on contract
  }

  async verify(
    publicWitness: string,
    proof: string,
    verificationKey: string,
  ): Promise<boolean> {
    //TODO: verify content-addressable hash exists in shield contract
    return true;
  }
}
