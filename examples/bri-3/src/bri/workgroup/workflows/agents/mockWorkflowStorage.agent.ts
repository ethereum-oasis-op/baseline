import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';

@Injectable()
export class MockWorkflowStorageAgent {
  private workflowsStore: Workflow[] = [];

  async getWorkflowById(id: string): Promise<Workflow> {
    const workflow = this.workflowsStore.find((ws) => ws.id === id);
    if (!workflow) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return workflow;
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    return Promise.resolve(this.workflowsStore);
  }

  async createNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const createdWs = new Workflow(
      uuidv4(),
      workflow.name,
      workflow.worksteps,
      workflow.workgroupId,
    );

    this.workflowsStore.push(createdWs);

    return Promise.resolve(createdWs);
  }

  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const wsToUpdate = this.workflowsStore.find((ws) => ws.id === workflow.id);
    Object.assign(wsToUpdate, workflow);
    return Promise.resolve(wsToUpdate);
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    const wsToDeleteIndex = this.workflowsStore.findIndex(
      (ws) => ws.id === workflow.id,
    );
    this.workflowsStore.splice(wsToDeleteIndex, 1);
  }
}
