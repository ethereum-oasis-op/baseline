import { Injectable, NotFoundException } from '@nestjs/common';
import { Workstep } from '../../worksteps/models/workstep';
import { Workflow } from '../models/workflow';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { WorkflowStorageAgent } from './workflowsStorage.agent';

@Injectable()
export class WorkflowAgent {
  constructor(private storageAgent: WorkflowStorageAgent) {}

  public createNewWorkflow(
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
  ): Workflow {
    return new Workflow(uuidv4(), name, worksteps, workgroupId);
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Workflow> {
    const workflowToUpdate = await this.storageAgent.getWorkflowById(id);

    if (!workflowToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workflowToUpdate;
  }

  public updateWorkflow(
    workflowToUpdate: Workflow,
    name: string,
    worksteps: Workstep[],
    workgroupId: string,
  ) {
    workflowToUpdate.updateName(name);
    workflowToUpdate.updateWorksteps(worksteps);
    workflowToUpdate.updateWorkgroupId(workgroupId);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Workflow> {
    const workflowToDelete = await this.storageAgent.getWorkflowById(id);

    if (!workflowToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return workflowToDelete;
  }
}
