import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BpiSubject } from "../models/bpiSubject";
import { BpiSubjectType } from "../models/bpiSubjectType.enum";

import { uuid } from 'uuidv4'; 
import { BpiSubjectRepository } from "../persistence/bpiSubjects.repository";
import { NotFoundError } from "rxjs";
 
// Agent methods have extremely declarative names and perform a single task 
@Injectable()
export class BpiSubjectAgent {

  constructor(private repo: BpiSubjectRepository) { }
  public throwIfCreateBpiSubjectInputInvalid(name: string, desc: string, pk: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..) 
    if (!name) {
      throw new BadRequestException("Name cannot be empty.")
    };
  }

  public createNewExternalBpiSubject(name :string, description: string, publicKey: string): BpiSubject {
    return new BpiSubject(uuid(), name, description, BpiSubjectType.External, publicKey );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(id: string, name: string, desc: string, pk: string): Promise<BpiSubject> {
    const bpiSubjectToUpdate = await this.repo.getBpiSubjectById(id);

    if(!bpiSubjectToUpdate) {
      throw new NotFoundException(`Bpi Subject with id: ${id} does not exist.`)
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
      throw new NotFoundException(`Bpi Subject with id: ${id} does not exist.`)
    }

    return bpiSubjectToDelete;
  }
}
