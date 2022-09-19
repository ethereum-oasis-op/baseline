import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BpiSubject } from "../models/bpiSubject";
import { BpiSubjectType } from "../models/bpiSubjectType.enum";

import { v4 as uuidv4 } from 'uuid';
import { NAME_EMPTY_ERR_MESSAGE, NOT_FOUND_ERR_MESSAGE } from "../api/err.messages";
import { BpiSubjectStorageAgent } from "./bpiSubjectsStorage.agent";
 
// Agent methods have extremely declarative names and perform a single task 
@Injectable()
export class BpiSubjectAgent {

  constructor(private repo: BpiSubjectStorageAgent) { }
  public throwIfCreateBpiSubjectInputInvalid(name: string, desc: string, pk: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..) 
    if (!name) {
      throw new BadRequestException(NAME_EMPTY_ERR_MESSAGE)
    };
  }

  public createNewExternalBpiSubject(name :string, description: string, publicKey: string): BpiSubject {
    return new BpiSubject(uuidv4(), name, description, BpiSubjectType.External, publicKey );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(id: string, name: string, desc: string, pk: string): Promise<BpiSubject> {
    const bpiSubjectToUpdate = await this.repo.getBpiSubjectById(id);

    if(!bpiSubjectToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectToUpdate;
  }

  public updateBpiSubject(bpiSubjectToUpdate: BpiSubject, name :string, description: string, publicKey: string) {
    bpiSubjectToUpdate.updateName(name);
    bpiSubjectToUpdate.updateDescription(description);
    bpiSubjectToUpdate.updatePublicKey(publicKey);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(id: string): Promise<BpiSubject> {

    const bpiSubjectToDelete = await this.repo.getBpiSubjectById(id);

    if(!bpiSubjectToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectToDelete;
  }
}
