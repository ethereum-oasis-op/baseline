import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { Workstep } from '../models/workstep';

@Injectable()
export class MockWorkstepRepository {
  private workstepsStore: Workstep[] = [];

  async getWorkstepById(id: string): Promise<Workstep> {
    return this.workstepsStore.find((bp) => bp.id === id);
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const createdWs = new Workstep(
      uuid(),
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
}
