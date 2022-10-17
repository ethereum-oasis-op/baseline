import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';

@Injectable()
export class MockWorkstepStorageAgent {
  private workstepsStore: Workstep[] = [];

  async getWorkstepById(id: string): Promise<Workstep> {
    const workstep = this.workstepsStore.find((ws) => ws.id === id);
    if (!workstep) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return workstep;
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    return Promise.resolve(this.workstepsStore);
  }

  async getMatchingWorkstepsById(workstepIds: string[]): Promise<Workstep[]> {
    const worksteps: Workstep[] = [];
    workstepIds.forEach((wsId) => {
      worksteps.push(this.workstepsStore.find((ws) => ws.id === wsId));
    });
    if (!worksteps.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return Promise.resolve(worksteps);
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const createdWs = new Workstep(
      uuidv4(),
      workstep.name,
      workstep.version,
      workstep.status,
      workstep.workgroupId,
      workstep.securityPolicy,
      workstep.privacyPolicy,
    );

    this.workstepsStore.push(createdWs);

    return Promise.resolve(createdWs);
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const wsToUpdate = this.workstepsStore.find((ws) => ws.id === workstep.id);
    Object.assign(wsToUpdate, workstep);
    return Promise.resolve(wsToUpdate);
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    const wsToDeleteIndex = this.workstepsStore.findIndex(
      (ws) => ws.id === workstep.id,
    );
    this.workstepsStore.splice(wsToDeleteIndex, 1);
  }
}
