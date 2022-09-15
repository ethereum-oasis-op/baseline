import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Privacy } from 'src/bri/policy/models/privacy';
import { Security } from 'src/bri/policy/models/security';
import { Workstep } from '../models/workstep';

import { uuid } from 'uuidv4';
import { WorkstepStorageAgent } from '../persistence/workstepsStorage.agent';

@Injectable()
export class WorkstepAgent {
  constructor(private repo: WorkstepStorageAgent) {}
  public throwIfCreateWorkstepInputInvalid(name: string, version: string, status: string, workgroupId: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules
    if (!name) {
      throw new BadRequestException('Name cannot be empty.');
    }
  }

  public createNewWorkstep( name: string, version: string, status: string, workgroupId: string, securityPolicy: Security, privacyPolicy: Privacy): Workstep {
    return new Workstep( uuid(), name, version, status, workgroupId, securityPolicy, privacyPolicy);
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(id:string, name: string, version: string, status: string, workgroupId: string): Promise<Workstep> {
    const workstepToUpdate = await this.repo.getWorkstepById(id);

    if(!workstepToUpdate) {
      throw new NotFoundException(`Workstep with id: ${id} does not exist.`)
    }

    return workstepToUpdate;
  }

  public updateWorkstep(workstepToUpdate: Workstep, name :string, version: string, status: string, workgroupId: string) {
    workstepToUpdate.updateName(name);
    workstepToUpdate.updateVersion(version);
    workstepToUpdate.updateStatus(status);
    workstepToUpdate.updateWorkgroupId(workgroupId);
  }
  
  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(id: string): Promise<Workstep> {

    const workstepToDelete = await this.repo.getWorkstepById(id);

    if(!workstepToDelete) {
      throw new NotFoundException(`Workstep with id: ${id} does not exist.`)
    }

    return workstepToDelete;
  }
}
