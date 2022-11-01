import { BadRequestException, Injectable } from '@nestjs/common';
import { INVALID_PROOF_INPUT } from '../api/err.messages';
import { v4 as uuidv4 } from 'uuid';
import { Proof } from '../models/proof';
import { ProofStorageAgent } from './proofStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';
import DocumentObject from '../types/document';
@Injectable()
export class ProofAgent {
  constructor(private storageAgent: ProofStorageAgent) {}

  public throwIfProofInputInvalid(document: DocumentObject): boolean {
    if (!document.documentObjectType || !document.documentObjectInput) {
      throw new BadRequestException(INVALID_PROOF_INPUT);
    }
    return true;
  }

  public createNewProof(
    owner: BpiAccount,
    document: DocumentObject,
    signature: string,
  ): Proof {
    const payload =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(
        document.documentObjectInput,
      );

    return new Proof(uuidv4(), owner, payload, signature);
  }

  public async verifyDocumentWithProof(
    document: DocumentObject,
  ): Promise<boolean> {
    const publicInputForProofVerfication =
      this.convertDocumentToPayloadAndThrowIfDocumentValidationFails(
        document.documentObjectInput,
      );
    const verified = await this.storageAgent.verifyProofInShieldContract(
      publicInputForProofVerfication,
    );
    return verified;
  }

  public convertDocumentToPayloadAndThrowIfDocumentValidationFails(
    document: object,
  ) {
    //TODO: Convert document into payload using merkleTree service
    const hash = Object.keys(document)[0];
    return hash;
  }
}
