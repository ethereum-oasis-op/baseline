import { Injectable } from '@nestjs/common';
import { Proof } from '../models/proof';
import { ProofStorageAgent } from './proofStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

@Injectable()
export class ProofAgent {
  constructor(private storageAgent: ProofStorageAgent) {}
  public throwIfCreateProofInputInvalid() {
    // TODO: This is a placeholder, we will add validation rules as we move forward with business logic implementation
    return true;
  }

  public createNewProof(
    id: string,
    owner: BpiAccount,
    document: any,
    signature: string,
  ): Proof {
    const payload =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(document);

    return new Proof(id, owner, payload, signature);
  }

  public async verifyDocumentWithProof(document: Proof): Promise<boolean> {
    const proofToVerify =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(document);
    const verified = await this.storageAgent.verifyProofInShieldContract(
      proofToVerify,
    );
    return verified;
  }

  public convertDocumentToPayloadAndThrowIfDocumentValidationFails(
    document: any,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = '';
    return hash;
  }
}
