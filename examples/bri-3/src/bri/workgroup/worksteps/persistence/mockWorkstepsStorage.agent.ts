import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Workstep } from '../models/workstep';

@Injectable()
export class MockWorkstepStorageAgent {
  private workstepsStore: Workstep[] = [];

  async getWorkstepById(id: string): Promise<Workstep> {
    return this.workstepsStore.find((ws) => ws.id === id);
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    return Promise.resolve(this.workstepsStore);
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const createdWs = new Workstep(
      v4(),
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
    const wsToUpdate = this.workstepsStore.find(ws => ws.id === workstep.id);
    Object.assign(wsToUpdate, workstep);
    return Promise.resolve(wsToUpdate);
  }

async deleteWorkstep(workstep: Workstep): Promise<void> {
    const wsToDeleteIndex = this.workstepsStore.findIndex(ws => ws.id === workstep.id);
    this.workstepsStore.splice(wsToDeleteIndex, 1);
  }
}
