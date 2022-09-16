import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Workstep } from '../models/workstep';

import { v4 as uuidv4 } from 'uuid';
import { NAME_EMPTY_ERR_MESSAGE, NOT_FOUND_ERR_MESSAGE } from "../api/err.messages";
import { WorkstepStorageAgent } from '../persistence/workstepsStorage.agent';

@Injectable()
export class WorkstepAgent {
  constructor(private storageAgent: WorkstepStorageAgent) {}
  public throwIfCreateWorkstepInputInvalid(name: string, version: string, status: string, workgroupId: string, securityPolicy: string, privacyPolicy: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules
    if (!name) {
      throw new BadRequestException(NAME_EMPTY_ERR_MESSAGE);
    }
  }

  public createNewWorkstep( name: string, version: string, status: string, workgroupId: string, securityPolicy: string, privacyPolicy: string): Workstep {
    return new Workstep( uuidv4(), name, version, status, workgroupId, securityPolicy, privacyPolicy);
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(id:string, name: string, version: string, status: string, workgroupId: string, securityPolicy: string, privacyPolicy: string): Promise<Workstep> {
    const workstepToUpdate = await this.storageAgent.getWorkstepById(id);

    if(!workstepToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE)
    }

    return workstepToUpdate;
  }

  public updateWorkstep(workstepToUpdate: Workstep, name :string, version: string, status: string, workgroupId: string, securityPolicy: string, privacyPolicy: string) {
    workstepToUpdate.updateName(name);
    workstepToUpdate.updateVersion(version);
    workstepToUpdate.updateStatus(status);
    workstepToUpdate.updateWorkgroupId(workgroupId);
    workstepToUpdate.updateSecurityPolicy(securityPolicy);
    workstepToUpdate.updatePrivacyPolicy(privacyPolicy);
  }
  
  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(id: string): Promise<Workstep> {

    const workstepToDelete = await this.storageAgent.getWorkstepById(id);

    if(!workstepToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workstepToDelete;
  }
}
