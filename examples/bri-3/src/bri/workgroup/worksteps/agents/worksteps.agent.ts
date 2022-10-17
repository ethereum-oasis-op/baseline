import { Injectable, NotFoundException } from '@nestjs/common';
import { Workstep } from '../models/workstep';

import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { WorkstepStorageAgent } from './workstepsStorage.agent';
import { LoggingService } from 'src/shared/logging/logging.service';

@Injectable()
export class WorkstepAgent {
  constructor(
    private storageAgent: WorkstepStorageAgent,
    private log: LoggingService,
  ) {}

  public createNewWorkstep(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: string,
    privacyPolicy: string,
  ): Workstep {
    return new Workstep(
      uuidv4(),
      name,
      version,
      status,
      workgroupId,
      securityPolicy,
      privacyPolicy,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Workstep> {
    const workstepToUpdate = await this.storageAgent.getWorkstepById(id);

    if (!workstepToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workstepToUpdate;
  }

  public updateWorkstep(
    workstepToUpdate: Workstep,
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: string,
    privacyPolicy: string,
  ) {
    workstepToUpdate.updateName(name);
    workstepToUpdate.updateVersion(version);
    workstepToUpdate.updateStatus(status);
    workstepToUpdate.updateWorkgroupId(workgroupId);
    workstepToUpdate.updateSecurityPolicy(securityPolicy);
    workstepToUpdate.updatePrivacyPolicy(privacyPolicy);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Workstep> {
    const workstepToDelete = await this.storageAgent.getWorkstepById(id);

    if (!workstepToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workstepToDelete;
  }
}
