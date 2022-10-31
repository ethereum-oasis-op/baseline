import { BadRequestException, Injectable } from '@nestjs/common';
import {
  INVALID_PROOF_INPUT,
  NOT_FOUND_ERR_MESSAGE,
} from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { Proof } from '../models/proof';
import { ProofStorageAgent } from './proofStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
@Injectable()
export class ProofAgent {
  constructor(private storageAgent: ProofStorageAgent) {}

  public throwIfProofInputInvalid(document: string): boolean {
    if (document === '') {
      throw new BadRequestException(INVALID_PROOF_INPUT);
    }
    return true;
  }

  public createNewProof(
    owner: BpiAccount,
    document: string,
    signature: string,
  ): Proof {
    const payload =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(document);

    return new Proof(uuidv4(), owner, payload, signature);
  }

  public async verifyDocumentWithProof(document: string): Promise<boolean> {
    const proofToVerify =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(document);
    const verified = await this.storageAgent.verifyProofInShieldContract(
      proofToVerify,
    );
    return verified;
  }

  public convertDocumentToPayloadAndThrowIfDocumentValidationFails(
    document: string,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = document;
    return hash;
  }
}
